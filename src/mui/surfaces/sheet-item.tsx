import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import type { ReactNode } from "react";

import { EnterInteractionGroup } from "../../domain/events/enter-group";
import type { InteractionNode } from "../../domain/interactions/base";
import { InteractionGroup } from "../../domain/interactions/group";
import { InputModality } from "../../domain/vocabulary/modality";
import type { InteractionIdentity } from "../../domain/interactions/identity";
import type { IconRegistry } from "../../ports/icon-registry";
import type { MuiInteractionBinding } from "../runtime/binding";
import { InteractionIconSelector } from "../shared/icon-selector";
import type { MuiInteractionReader } from "../shared/reader";

export interface CommandSheetItemProps {
  readonly node: InteractionNode;
  readonly origin: InteractionIdentity;
  readonly binding: MuiInteractionBinding;
  readonly reader: MuiInteractionReader;
  readonly icons: IconRegistry;
}

export function CommandSheetItem({
  node,
  origin,
  binding,
  reader,
  icons,
}: CommandSheetItemProps): ReactNode {
  const group = node instanceof InteractionGroup;
  return (
    <ListItemButton
      id={binding.identities.interaction(node.identity)}
      disabled={!group && !node.availability.activatable}
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
        if (group) {
          binding.send(new EnterInteractionGroup(node.identity));
        } else {
          binding.activate(origin, node.identity);
        }
      }}
    >
      <ListItemIcon>
        {icons.resolve(node.icon, new InteractionIconSelector().select(node))}
      </ListItemIcon>
      <ListItemText primary={node.name.value} />
    </ListItemButton>
  );
}
