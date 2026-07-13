import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  useCallback,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { EnterInteractionGroup } from "../../domain/events/enter-group";
import { LeaveInteractionGroup } from "../../domain/events/leave-group";
import type { InteractionGroup } from "../../domain/interactions/group";
import type { InteractionIdentity } from "../../domain/interactions/identity";
import type { IconRegistry } from "../../ports/icon-registry";
import { LayoutDirection } from "../../domain/vocabulary/directionality";
import { InputModality } from "../../domain/vocabulary/modality";
import { SurfaceIdentityRole } from "../../domain/vocabulary/surface-role";
import type { MuiInteractionBinding } from "../runtime/binding";
import { InteractionDomIdentity } from "../runtime/dom-identity";
import { InteractionIconSelector } from "./icon-selector";
import { MuiKeyboardAdapter } from "./keyboard";
import type { MuiInteractionReader } from "./reader";

export interface NestedMenuProps {
  readonly group: InteractionGroup;
  readonly origin: InteractionIdentity;
  readonly binding: MuiInteractionBinding;
  readonly reader: MuiInteractionReader;
  readonly icons: IconRegistry;
  readonly children: ReactNode;
  readonly direction: LayoutDirection;
}

export function NestedMenu({
  group,
  origin,
  binding,
  reader,
  icons,
  children,
  direction,
}: NestedMenuProps): ReactNode {
  const [anchor, setAnchor] = useState<HTMLLIElement | null>(null);
  const captureAnchor = useCallback((element: HTMLLIElement | null) => {
    setAnchor(element);
  }, []);
  const open = reader.expanded(binding.getSnapshot(), group.identity);
  const keyboard = new MuiKeyboardAdapter(
    binding,
    reader,
    group.identity,
    direction,
  );
  const opensRight = direction === LayoutDirection.leftToRight;
  return (
    <>
      <MenuItem
        ref={captureAnchor}
        id={InteractionDomIdentity.from(group.identity)}
        aria-haspopup="menu"
        aria-controls={InteractionDomIdentity.from(
          group.identity.child(SurfaceIdentityRole.menuSurface),
        )}
        aria-expanded={open}
        onClick={() => {
          binding.send(new EnterInteractionGroup(group.identity));
        }}
        onPointerDown={() => {
          binding.modality(InputModality.pointer);
        }}
        onTouchStart={() => {
          binding.modality(InputModality.touch);
        }}
        onMouseEnter={() => {
          binding.hoverOpen(origin, group.identity);
        }}
        onMouseLeave={() => {
          binding.hoverClose(group.identity);
        }}
      >
        <ListItemIcon>
          {icons.resolve(
            group.icon,
            new InteractionIconSelector().select(group),
          )}
        </ListItemIcon>
        <ListItemText primary={group.name.value} />
      </MenuItem>
      <Menu
        id={InteractionDomIdentity.from(
          group.identity.child(SurfaceIdentityRole.menuSurface),
        )}
        anchorEl={anchor}
        anchorOrigin={{
          horizontal: opensRight ? "right" : "left",
          vertical: "top",
        }}
        transformOrigin={{
          horizontal: opensRight ? "left" : "right",
          vertical: "top",
        }}
        open={open && anchor !== null}
        onClose={() => {
          binding.send(new LeaveInteractionGroup(group.identity));
        }}
        onKeyDown={(event: KeyboardEvent) => {
          keyboard.handle(event);
          event.stopPropagation();
        }}
        onMouseEnter={() => {
          binding.hoverOpen(origin, group.identity);
        }}
        onMouseLeave={() => {
          binding.hoverClose(group.identity);
        }}
        variant="menu"
        slotProps={{
          list: {
            dense: true,
            disabledItemsFocusable: true,
            "aria-label": group.name.value,
          },
        }}
      >
        {children}
      </Menu>
    </>
  );
}
