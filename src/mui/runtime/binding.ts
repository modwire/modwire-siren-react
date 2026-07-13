import type { UiDispatcher } from "../../adapters/dispatcher";
import { UiInteractionActivator } from "../../adapters/activation";
import { CommandFactory } from "../../adapters/command";
import { LocaleInteractionMatcher } from "../../adapters/collator";
import { SilentRendererObserver } from "../../adapters/silent-renderer";
import { BrowserInteractionScheduler } from "../../adapters/timeout";
import type { InteractionEvent } from "../../domain/events/base";
import { ReplaceInteractionTree } from "../../domain/events/replace-tree";
import { ActivateInteraction } from "../../domain/events/activate";
import { ChangeInputModality } from "../../domain/events/change-modality";
import { OpenInteraction } from "../../domain/events/open";
import type { InteractionIdentity } from "../../domain/interactions/identity";
import type { InteractionTree } from "../../domain/interactions/tree";
import type { InteractionSnapshot } from "../../domain/state/snapshot";
import { InputModality } from "../../domain/vocabulary/modality";
import { InteractionController } from "../../interactions/controller";
import { HoverIntentController } from "../../interactions/hover";
import type { InteractionObserver } from "../../ports/interaction-observer";
import type { InteractionSubscription } from "../../ports/interaction-subscription";
import type { RendererObserver } from "../../ports/renderer-observer";
import { MuiInteractionDefaults } from "./defaults";

export class MuiInteractionBinding implements InteractionObserver {
  private readonly listeners = new Set<() => void>();
  private readonly controller: InteractionController;
  private readonly hover: HoverIntentController;
  private readonly subscription: InteractionSubscription;
  private generation = 0;
  private disposed = false;

  constructor(
    dispatcher: UiDispatcher,
    tree: InteractionTree,
    locale: string,
    private readonly observer: RendererObserver = new SilentRendererObserver(),
  ) {
    const scheduler = new BrowserInteractionScheduler();
    this.controller = new InteractionController(
      tree,
      InputModality.keyboard,
      new UiInteractionActivator(new CommandFactory(), dispatcher),
      scheduler,
      new LocaleInteractionMatcher(locale),
      new MuiInteractionDefaults().typeahead(),
    );
    this.subscription = this.controller.subscribe(this);
    this.hover = new HoverIntentController(
      this.controller,
      scheduler,
      new MuiInteractionDefaults().hover(),
    );
  }

  readonly getSnapshot = (): InteractionSnapshot => this.controller.snapshot;

  readonly getServerSnapshot = (): InteractionSnapshot =>
    this.controller.snapshot;

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  changed(): void {
    for (const listener of [...this.listeners]) listener();
  }

  send(event: InteractionEvent): void {
    void this.controller.dispatch(event).catch((error: unknown) => {
      this.observer.failed(error);
    });
  }

  replace(tree: InteractionTree): void {
    this.send(new ReplaceInteractionTree(tree));
  }

  activate(origin: InteractionIdentity, target: InteractionIdentity): void {
    this.send(new OpenInteraction(origin, target));
    this.send(new ActivateInteraction(target));
  }

  modality(modality: InputModality): void {
    this.send(new ChangeInputModality(modality));
  }

  hoverOpen(origin: InteractionIdentity, target: InteractionIdentity): void {
    this.modality(InputModality.pointer);
    this.hover.enter(origin, target);
  }

  hoverClose(target: InteractionIdentity): void {
    this.hover.leave(target);
  }

  mount(): () => void {
    this.generation += 1;
    const mounted = this.generation;
    return () => {
      queueMicrotask(() => {
        if (mounted === this.generation) this.dispose();
      });
    };
  }

  private dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.hover.dispose();
    this.subscription.unsubscribe();
    this.controller.dispose();
    this.listeners.clear();
  }
}
