import type { KeyboardEvent } from "react";

import { DismissInteraction } from "../../domain/events/dismiss";
import { EnterInteractionGroup } from "../../domain/events/enter-group";
import { LeaveInteractionGroup } from "../../domain/events/leave-group";
import { MoveInteraction } from "../../domain/events/move";
import { SearchInteractions } from "../../domain/events/search";
import { InteractionGroup } from "../../domain/interactions/group";
import type { InteractionIdentity } from "../../domain/interactions/identity";
import { InteractionDirection } from "../../domain/vocabulary/direction";
import { InputModality } from "../../domain/vocabulary/modality";
import { LayoutDirection } from "../../domain/vocabulary/directionality";
import type { MuiInteractionBinding } from "../runtime/binding";
import { BrowserKey } from "./keys";
import type { MuiInteractionReader } from "./reader";

export class MuiKeyboardAdapter {
  constructor(
    private readonly binding: MuiInteractionBinding,
    private readonly reader: MuiInteractionReader,
    private readonly root: InteractionIdentity,
    private readonly direction: LayoutDirection,
  ) {}

  handle(event: KeyboardEvent): void {
    this.binding.modality(InputModality.keyboard);
    const active = this.reader.active(this.binding.getSnapshot());
    if (event.key === BrowserKey.arrowDown) {
      this.move(event, InteractionDirection.next);
    } else if (event.key === BrowserKey.arrowUp) {
      this.move(event, InteractionDirection.previous);
    } else if (event.key === BrowserKey.home) {
      this.move(event, InteractionDirection.first);
    } else if (event.key === BrowserKey.end) {
      this.move(event, InteractionDirection.last);
    } else if (this.enters(event.key)) {
      const node = this.reader.node(active);
      if (node instanceof InteractionGroup) {
        event.preventDefault();
        this.binding.send(new EnterInteractionGroup(active));
      }
    } else if (this.leaves(event.key)) {
      event.preventDefault();
      this.binding.send(
        new LeaveInteractionGroup(
          this.reader.currentGroup(this.binding.getSnapshot()).identity,
        ),
      );
    } else if (event.key === BrowserKey.escape) {
      event.preventDefault();
      const group = this.reader.currentGroup(this.binding.getSnapshot());
      this.binding.send(
        group.identity.value === this.root.value
          ? new DismissInteraction()
          : new LeaveInteractionGroup(group.identity),
      );
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      this.binding.send(new SearchInteractions(event.key));
    }
  }

  private move(event: KeyboardEvent, direction: InteractionDirection): void {
    event.preventDefault();
    this.binding.send(new MoveInteraction(direction));
  }

  private enters(key: string): boolean {
    return this.direction === LayoutDirection.leftToRight
      ? key === BrowserKey.arrowRight
      : key === BrowserKey.arrowLeft;
  }

  private leaves(key: string): boolean {
    return this.direction === LayoutDirection.leftToRight
      ? key === BrowserKey.arrowLeft
      : key === BrowserKey.arrowRight;
  }
}
