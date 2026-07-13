import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";
import { ShortcutKind } from "../vocabulary/shortcut-kind";
import { InteractionShortcut } from "./shortcut";

export class KeyboardShortcut extends InteractionShortcut {
  readonly keys: readonly string[];

  constructor(keys: readonly string[]) {
    super(ShortcutKind.keyboard);
    const normalized = keys.map((key) => key.trim());
    if (normalized.length === 0 || normalized.some((key) => key === "")) {
      throw new SirenReactError(
        SirenReactCode.interactionShortcut,
        "Keyboard shortcut requires named keys",
      );
    }
    this.keys = Object.freeze(normalized);
    Object.freeze(this);
  }
}
