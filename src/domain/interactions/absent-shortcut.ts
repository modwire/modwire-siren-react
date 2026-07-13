import { ShortcutKind } from "../vocabulary/shortcut-kind";
import { InteractionShortcut } from "./shortcut";

export class AbsentShortcut extends InteractionShortcut {
  constructor() {
    super(ShortcutKind.absent);
    Object.freeze(this);
  }
}
