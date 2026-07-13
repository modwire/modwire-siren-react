import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import type { ReactNode } from "react";

import type { InteractionNode } from "../../domain/interactions/base";
import type { InteractionIdentity } from "../../domain/interactions/identity";
import { InputModality } from "../../domain/vocabulary/modality";
import { SurfaceIdentityRole } from "../../domain/vocabulary/surface-role";
import type { IconRegistry } from "../../ports/icon-registry";
import type { MuiInteractionBinding } from "../runtime/binding";
import { InteractionDomIdentity } from "../runtime/dom-identity";
import { InteractionIconSelector } from "../shared/icon-selector";
import type { MuiInteractionReader } from "../shared/reader";
import { ShortcutLabel } from "../shared/shortcut";

export interface CommandPaletteItemProps {
  readonly node: InteractionNode;
  readonly origin: InteractionIdentity;
  readonly binding: MuiInteractionBinding;
  readonly reader: MuiInteractionReader;
  readonly icons: IconRegistry;
}

export function CommandPaletteItem({
  node,
  origin,
  binding,
  reader,
  icons,
}: CommandPaletteItemProps): ReactNode {
  const selected =
    reader.active(binding.getSnapshot()).value === node.identity.value;
  return (
    <ListItemButton
      id={InteractionDomIdentity.from(
        node.identity.child(SurfaceIdentityRole.paletteResult),
      )}
      role="option"
      aria-selected={selected}
      disabled={!node.availability.activatable}
      selected={selected}
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
      <ListItemText
        primary={node.name.value}
        secondary={reader.ancestry(node.identity)}
      />
      <ShortcutLabel shortcut={node.shortcut} />
    </ListItemButton>
  );
}
