import Divider from "@mui/material/Divider";
import type { ReactNode } from "react";

import { InteractionDivider } from "../../domain/interactions/divider";
import type { InteractionGroup } from "../../domain/interactions/group";
import { InteractionGroup as Group } from "../../domain/interactions/group";
import type { InteractionIdentity } from "../../domain/interactions/identity";
import type { IconRegistry } from "../../ports/icon-registry";
import type { LayoutDirection } from "../../domain/vocabulary/directionality";
import type { MuiInteractionBinding } from "../runtime/binding";
import { MenuLeaf } from "./leaf";
import { NestedMenu } from "./nested";
import type { MuiInteractionReader } from "./reader";

export interface MenuItemsProps {
  readonly group: InteractionGroup;
  readonly origin: InteractionIdentity;
  readonly binding: MuiInteractionBinding;
  readonly reader: MuiInteractionReader;
  readonly icons: IconRegistry;
  readonly direction: LayoutDirection;
}

export function MenuItems({
  group,
  origin,
  binding,
  reader,
  icons,
  direction,
}: MenuItemsProps): ReactNode {
  return group.children.values.map((node) => {
    if (node instanceof InteractionDivider) {
      return <Divider key={node.identity.value} />;
    }
    if (node instanceof Group) {
      return (
        <NestedMenu
          key={node.identity.value}
          group={node}
          origin={origin}
          binding={binding}
          reader={reader}
          icons={icons}
          direction={direction}
        >
          <MenuItems
            group={node}
            origin={origin}
            binding={binding}
            reader={reader}
            icons={icons}
            direction={direction}
          />
        </NestedMenu>
      );
    }
    return (
      <MenuLeaf
        key={node.identity.value}
        node={node}
        origin={origin}
        binding={binding}
        reader={reader}
        icons={icons}
      />
    );
  });
}
