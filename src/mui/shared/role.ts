import type { AriaRole } from "react";

import type { InteractionNode } from "../../domain/interactions/base";
import { ChoiceInteraction } from "../../domain/interactions/choice";
import { ToggleInteraction } from "../../domain/interactions/toggle";

export class MenuItemSemantics {
  attributes(node: InteractionNode): {
    readonly role: AriaRole;
    readonly "aria-checked"?: boolean;
  } {
    if (node instanceof ToggleInteraction) {
      return { role: "menuitemcheckbox", "aria-checked": node.selected };
    }
    if (node instanceof ChoiceInteraction) {
      return { role: "menuitemradio", "aria-checked": node.selected };
    }
    return { role: "menuitem" };
  }
}
