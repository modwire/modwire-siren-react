import { CompletedTask } from "../adapters/completed";
import type { ActivateInteraction } from "../domain/events/activate";
import type { InteractionEvent } from "../domain/events/base";
import type { ChangeInputModality } from "../domain/events/change-modality";
import type { EnterInteractionGroup } from "../domain/events/enter-group";
import type { LeaveInteractionGroup } from "../domain/events/leave-group";
import type { MoveInteraction } from "../domain/events/move";
import type { OpenInteraction } from "../domain/events/open";
import type { ReplaceInteractionTree } from "../domain/events/replace-tree";
import type { SearchInteractions } from "../domain/events/search";
import type { InteractionEventVisitor } from "../domain/events/visitor";
import { MoveFocus } from "../domain/focus/move";
import { RetainFocus } from "../domain/focus/retain";
import type { InteractionIntent } from "../domain/intents/base";
import type { InteractionNode } from "../domain/interactions/base";
import { ChoiceInteraction } from "../domain/interactions/choice";
import { CommandInteraction } from "../domain/interactions/command";
import { DestinationInteraction } from "../domain/interactions/destination";
import { InteractionGroup } from "../domain/interactions/group";
import type { InteractionIdentity } from "../domain/interactions/identity";
import { ToggleInteraction } from "../domain/interactions/toggle";
import type { InteractionTree } from "../domain/interactions/tree";
import { ActivatingInteractionState } from "../domain/state/activating";
import { ClosedInteractionState } from "../domain/state/closed";
import { OpenInteractionState } from "../domain/state/open";
import { SearchingInteractionState } from "../domain/state/searching";
import { InteractionSnapshot } from "../domain/state/snapshot";
import type { InputModality } from "../domain/vocabulary/modality";
import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";
import { SirenReactIssue } from "../errors/issue";
import { SirenReactIssues } from "../errors/issues";
import type { TypeaheadPolicy } from "../policy/typeahead";
import type { InteractionActivator } from "../ports/activator";
import type { InteractionObserver } from "../ports/interaction-observer";
import type { InteractionSubscription } from "../ports/interaction-subscription";
import type { InteractionMatcher } from "../ports/matcher";
import type { InteractionScheduler } from "../ports/scheduler";
import type { ScheduledTask } from "../ports/task";
import { InteractionIndex } from "./catalog";
import { InteractionNavigator } from "./navigation";
import { InteractionReplacement } from "./replacement";
import { ControllerSubscription } from "./subscription";
import { InteractionTypeahead } from "./typeahead";

export class InteractionController implements InteractionEventVisitor<
  Promise<InteractionSnapshot>
> {
  private readonly observers = new Set<InteractionObserver>();
  private readonly navigator = new InteractionNavigator();
  private readonly typeahead: InteractionTypeahead;
  private readonly replacement: InteractionReplacement;
  private index: InteractionIndex;
  private current: InteractionSnapshot;
  private searchTask: ScheduledTask = new CompletedTask();
  private activationSequence = 0;
  private disposed = false;

  constructor(
    tree: InteractionTree,
    modality: InputModality,
    private readonly activator: InteractionActivator,
    private readonly scheduler: InteractionScheduler,
    matcher: InteractionMatcher,
    policy: TypeaheadPolicy,
  ) {
    this.index = new InteractionIndex(tree);
    this.typeahead = new InteractionTypeahead(matcher, policy);
    this.replacement = new InteractionReplacement(this.typeahead);
    this.current = new InteractionSnapshot(
      new ClosedInteractionState(tree),
      modality,
      new RetainFocus(),
      SirenReactIssues.empty(),
    );
  }

  get snapshot(): InteractionSnapshot {
    return this.current;
  }

  dispatch(event: InteractionEvent): Promise<InteractionSnapshot> {
    this.assertAvailable();
    return event.accept(this);
  }

  subscribe(observer: InteractionObserver): InteractionSubscription {
    this.assertAvailable();
    this.observers.add(observer);
    try {
      observer.changed(this.current);
    } catch {
      this.observers.delete(observer);
    }
    return new ControllerSubscription(() => {
      this.observers.delete(observer);
    });
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.activationSequence += 1;
    this.searchTask.cancel();
    this.observers.clear();
  }

  open(event: OpenInteraction): Promise<InteractionSnapshot> {
    this.invalidateActivation();
    return Promise.resolve(
      this.commit(this.navigator.open(this.current, this.index, event)),
    );
  }

  dismiss(): Promise<InteractionSnapshot> {
    this.invalidateActivation();
    this.searchTask.cancel();
    return Promise.resolve(
      this.commit(this.navigator.dismiss(this.current, this.index)),
    );
  }

  move(event: MoveInteraction): Promise<InteractionSnapshot> {
    const candidate =
      this.current.state instanceof SearchingInteractionState
        ? this.typeahead.move(this.current, this.index, event.direction)
        : this.navigator.move(this.current, this.index, event);
    return Promise.resolve(this.commit(candidate));
  }

  enterGroup(event: EnterInteractionGroup): Promise<InteractionSnapshot> {
    return Promise.resolve(
      this.commit(this.navigator.enter(this.current, this.index, event)),
    );
  }

  leaveGroup(event: LeaveInteractionGroup): Promise<InteractionSnapshot> {
    return Promise.resolve(
      this.commit(this.navigator.leave(this.current, this.index, event)),
    );
  }

  async activate(event: ActivateInteraction): Promise<InteractionSnapshot> {
    const state = this.current.state;
    if (
      !(state instanceof OpenInteractionState) &&
      !(state instanceof SearchingInteractionState)
    ) {
      return this.commit(this.navigator.missing(this.current, event.target));
    }
    const resolution = this.index.resolve(event.target);
    if (!resolution.present) {
      return this.commit(this.navigator.missing(this.current, event.target));
    }
    const node = resolution.require().node;
    if (node instanceof InteractionGroup) {
      return this.commit(
        this.navigator.enterIdentity(
          this.current,
          this.index,
          node.identity,
          state.origin,
        ),
      );
    }
    if (!node.availability.activatable) return this.disabled(node.identity);
    const active = resolution.require().path;
    const origin = state.origin;
    const sequence = this.activationSequence + 1;
    this.activationSequence = sequence;
    this.commit(
      new InteractionSnapshot(
        new ActivatingInteractionState(this.index.tree, node.identity, origin),
        this.current.modality,
        new RetainFocus(),
        SirenReactIssues.empty(),
      ),
    );
    try {
      await this.activator.activate(this.intent(node));
      if (sequence !== this.activationSequence || this.disposed) {
        return this.current;
      }
      return this.commit(
        this.navigator.close(this.current, this.index, origin),
      );
    } catch (error: unknown) {
      if (sequence !== this.activationSequence || this.disposed) throw error;
      this.commit(
        new InteractionSnapshot(
          new OpenInteractionState(this.index.tree, active, origin),
          this.current.modality,
          new MoveFocus(node.identity),
          SirenReactIssues.empty(),
        ),
      );
      throw error;
    }
  }

  search(event: SearchInteractions): Promise<InteractionSnapshot> {
    this.searchTask.cancel();
    const candidate = this.typeahead.search(this.current, this.index, event);
    if (candidate.state instanceof SearchingInteractionState) {
      this.searchTask = this.scheduler.schedule(
        this.typeahead.policy.resetDelay,
        () => {
          this.expireSearch();
        },
      );
    }
    return Promise.resolve(this.commit(candidate));
  }

  changeModality(event: ChangeInputModality): Promise<InteractionSnapshot> {
    return Promise.resolve(
      this.commit(
        new InteractionSnapshot(
          this.current.state,
          event.modality,
          new RetainFocus(),
          SirenReactIssues.empty(),
        ),
      ),
    );
  }

  replaceTree(event: ReplaceInteractionTree): Promise<InteractionSnapshot> {
    const activating = this.current.state instanceof ActivatingInteractionState;
    this.index = new InteractionIndex(event.tree);
    const candidate = this.replacement.replace(
      this.current,
      this.index,
      event.tree,
    );
    if (
      activating &&
      !(candidate.state instanceof ActivatingInteractionState)
    ) {
      this.activationSequence += 1;
    }
    return Promise.resolve(this.commit(candidate));
  }

  private disabled(identity: InteractionIdentity): InteractionSnapshot {
    return this.commit(
      new InteractionSnapshot(
        this.current.state,
        this.current.modality,
        new RetainFocus(),
        new SirenReactIssues([
          new SirenReactIssue(
            SirenReactCode.interactionDisabled,
            identity.value,
            "Interaction is not activatable",
          ),
        ]),
      ),
    );
  }

  private intent(node: InteractionNode): InteractionIntent {
    if (node instanceof CommandInteraction) return node.intent;
    if (node instanceof DestinationInteraction) return node.intent;
    if (node instanceof ToggleInteraction) return node.intent;
    if (node instanceof ChoiceInteraction) return node.intent;
    throw new SirenReactError(
      SirenReactCode.interactionDisabled,
      "Interaction does not carry an activation intent",
    );
  }

  private expireSearch(): void {
    if (this.disposed) return;
    this.commit(this.typeahead.expire(this.current, this.index));
  }

  private invalidateActivation(): void {
    if (this.current.state instanceof ActivatingInteractionState) {
      this.activationSequence += 1;
    }
  }

  private commit(candidate: InteractionSnapshot): InteractionSnapshot {
    if (candidate === this.current) return this.current;
    this.current = candidate;
    for (const observer of [...this.observers]) {
      try {
        observer.changed(this.current);
      } catch {
        continue;
      }
    }
    return this.current;
  }

  private assertAvailable(): void {
    if (this.disposed) {
      throw new SirenReactError(
        SirenReactCode.controllerDisposed,
        "Interaction controller is disposed",
      );
    }
  }
}
