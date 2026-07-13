import type { KeyboardEvent } from "react";

import { DismissInteraction } from "../../domain/events/dismiss";
import { EnterInteractionGroup } from "../../domain/events/enter-group";
import { MoveInteraction } from "../../domain/events/move";
import { InteractionGroup } from "../../domain/interactions/group";
import { InteractionDirection } from "../../domain/vocabulary/direction";
import { InputModality } from "../../domain/vocabulary/modality";
import { LayoutDirection } from "../../domain/vocabulary/directionality";
import type { MuiInteractionBinding } from "../runtime/binding";
import { BrowserKey } from "./keys";
import type { MuiInteractionReader } from "./reader";

export class MuiBarKeyboardAdapter {
  constructor(
    private readonly binding: MuiInteractionBinding,
    private readonly reader: MuiInteractionReader,
    private readonly direction: LayoutDirection,
  ) {}

  handle(event: KeyboardEvent): void {
    this.binding.modality(InputModality.keyboard);
    if (event.key === BrowserKey.arrowRight) {
      this.move(
        event,
        this.direction === LayoutDirection.leftToRight
          ? InteractionDirection.next
          : InteractionDirection.previous,
      );
    } else if (event.key === BrowserKey.arrowLeft) {
      this.move(
        event,
        this.direction === LayoutDirection.leftToRight
          ? InteractionDirection.previous
          : InteractionDirection.next,
      );
    } else if (event.key === BrowserKey.home) {
      this.move(event, InteractionDirection.first);
    } else if (event.key === BrowserKey.end) {
      this.move(event, InteractionDirection.last);
    } else if (event.key === BrowserKey.arrowDown) {
      const active = this.reader.active(this.binding.getSnapshot());
      if (this.reader.node(active) instanceof InteractionGroup) {
        event.preventDefault();
        this.binding.send(new EnterInteractionGroup(active));
      }
    } else if (event.key === BrowserKey.escape) {
      event.preventDefault();
      this.binding.send(new DismissInteraction());
    }
  }

  private move(event: KeyboardEvent, direction: InteractionDirection): void {
    event.preventDefault();
    this.binding.send(new MoveInteraction(direction));
  }
}
