import Menu from "@mui/material/Menu";
import type { KeyboardEvent, ReactNode } from "react";

import { DismissInteraction } from "../../domain/events/dismiss";
import type { InteractionGroup } from "../../domain/interactions/group";
import type { InteractionIdentity } from "../../domain/interactions/identity";
import type { IconRegistry } from "../../ports/icon-registry";
import type { LayoutDirection } from "../../domain/vocabulary/directionality";
import type { MuiInteractionBinding } from "../runtime/binding";
import { SurfaceIdentityRole } from "../../domain/vocabulary/surface-role";
import { MuiKeyboardAdapter } from "./keyboard";
import { MenuItems } from "./menu-items";
import type { MuiInteractionReader } from "./reader";

export interface CascadingMenuProps {
  readonly anchor: HTMLElement | null;
  readonly group: InteractionGroup;
  readonly origin: InteractionIdentity;
  readonly binding: MuiInteractionBinding;
  readonly reader: MuiInteractionReader;
  readonly icons: IconRegistry;
  readonly direction: LayoutDirection;
}

export function CascadingMenu({
  anchor,
  group,
  origin,
  binding,
  reader,
  icons,
  direction,
}: CascadingMenuProps): ReactNode {
  const keyboard = new MuiKeyboardAdapter(
    binding,
    reader,
    group.identity,
    direction,
  );
  return (
    <Menu
      id={binding.identities.interaction(
        group.identity.child(SurfaceIdentityRole.menuSurface),
      )}
      anchorEl={anchor}
      open={reader.isOpen(binding.getSnapshot()) && anchor !== null}
      onClose={() => {
        binding.send(new DismissInteraction());
      }}
      onKeyDown={(event: KeyboardEvent) => {
        keyboard.handle(event);
        event.stopPropagation();
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
      <MenuItems
        group={group}
        origin={origin}
        binding={binding}
        reader={reader}
        icons={icons}
        direction={direction}
      />
    </Menu>
  );
}
