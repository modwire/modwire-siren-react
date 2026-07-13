import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import type { ReactNode } from "react";

import type { InteractionNode } from "../../domain/interactions/base";
import type { InteractionIdentity } from "../../domain/interactions/identity";
import { InputModality } from "../../domain/vocabulary/modality";
import type { IconRegistry } from "../../ports/icon-registry";
import type { MuiInteractionBinding } from "../runtime/binding";
import { InteractionIconSelector } from "./icon-selector";
import type { MuiInteractionReader } from "./reader";
import { MenuItemSemantics } from "./role";
import { ShortcutLabel } from "./shortcut";

export interface MenuLeafProps {
  readonly node: InteractionNode;
  readonly origin: InteractionIdentity;
  readonly binding: MuiInteractionBinding;
  readonly reader: MuiInteractionReader;
  readonly icons: IconRegistry;
}

export function MenuLeaf({
  node,
  origin,
  binding,
  reader,
  icons,
}: MenuLeafProps): ReactNode {
  const semantics = new MenuItemSemantics();
  return (
    <MenuItem
      id={binding.identities.interaction(node.identity)}
      {...semantics.attributes(node)}
      disabled={!node.availability.activatable}
      selected={
        reader.active(binding.getSnapshot()).value === node.identity.value
      }
      onPointerDown={() => {
        binding.modality(InputModality.pointer);
      }}
      onTouchStart={() => {
        binding.modality(InputModality.touch);
      }}
      onClick={() => {
        binding.activate(origin, node.identity);
      }}
    >
      <ListItemIcon>
        {icons.resolve(node.icon, new InteractionIconSelector().select(node))}
      </ListItemIcon>
      <ListItemText primary={node.name.value} />
      <ShortcutLabel shortcut={node.shortcut} />
    </MenuItem>
  );
}
