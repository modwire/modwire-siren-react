import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useCallback, useState, type ReactNode } from "react";

import { OpenInteraction } from "../../domain/events/open";
import { DismissInteraction } from "../../domain/events/dismiss";
import type { InteractionNode } from "../../domain/interactions/base";
import { InteractionGroup } from "../../domain/interactions/group";
import type { IconRegistry } from "../../ports/icon-registry";
import type { LayoutDirection } from "../../domain/vocabulary/directionality";
import { InputModality } from "../../domain/vocabulary/modality";
import { SurfaceIdentityRole } from "../../domain/vocabulary/surface-role";
import type { MuiInteractionBinding } from "../runtime/binding";
import { CascadingMenu } from "../shared/cascade";
import { ExpandableAttributes } from "../shared/expandable";
import { InteractionIconSelector } from "../shared/icon-selector";
import type { MuiInteractionReader } from "../shared/reader";

export interface CommandBarItemProps {
  readonly node: InteractionNode;
  readonly binding: MuiInteractionBinding;
  readonly reader: MuiInteractionReader;
  readonly icons: IconRegistry;
  readonly direction: LayoutDirection;
}

export function CommandBarItem({
  node,
  binding,
  reader,
  icons,
  direction,
}: CommandBarItemProps): ReactNode {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const captureAnchor = useCallback((element: HTMLButtonElement | null) => {
    setAnchor(element);
  }, []);
  const group = node instanceof InteractionGroup;
  const expanded =
    group && reader.expanded(binding.getSnapshot(), node.identity);
  return (
    <>
      <Tooltip title={node.name.value}>
        <IconButton
          ref={captureAnchor}
          id={binding.identities.interaction(node.identity)}
          role="menuitem"
          aria-label={node.name.value}
          {...new ExpandableAttributes().for(
            group,
            expanded,
            binding.identities.interaction(
              node.identity.child(SurfaceIdentityRole.menuSurface),
            ),
          )}
          disabled={!group && !node.availability.activatable}
          onFocus={() => {
            if (!group) {
              binding.send(new OpenInteraction(node.identity, node.identity));
            }
          }}
          onClick={() => {
            if (group) {
              binding.send(
                expanded
                  ? new DismissInteraction()
                  : new OpenInteraction(node.identity, node.identity),
              );
            } else {
              binding.activate(node.identity, node.identity);
            }
          }}
          onPointerDown={() => {
            binding.modality(InputModality.pointer);
          }}
          onTouchStart={() => {
            binding.modality(InputModality.touch);
          }}
          onMouseEnter={() => {
            if (group && reader.isOpen(binding.getSnapshot())) {
              binding.hoverOpen(node.identity, node.identity);
            }
          }}
          onMouseLeave={() => {
            if (group) binding.hoverClose(node.identity);
          }}
        >
          {icons.resolve(node.icon, new InteractionIconSelector().select(node))}
        </IconButton>
      </Tooltip>
      {node instanceof InteractionGroup && (
        <CascadingMenu
          anchor={anchor}
          group={node}
          origin={node.identity}
          binding={binding}
          reader={reader}
          icons={icons}
          direction={direction}
        />
      )}
    </>
  );
}
