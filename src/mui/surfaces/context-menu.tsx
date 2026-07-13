import Menu from "@mui/material/Menu";
import {
  useMemo,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

import { DismissInteraction } from "../../domain/events/dismiss";
import { OpenInteraction } from "../../domain/events/open";
import { SurfaceIdentityRole } from "../../domain/vocabulary/surface-role";
import { InputModality } from "../../domain/vocabulary/modality";
import type { ContextMenuProps } from "../../ports/context-menu-props";
import { SirenThemeProvider } from "../../theme/provider";
import { useInteractionBinding } from "../runtime/use-binding";
import { InteractionDomIdentity } from "../runtime/dom-identity";
import { BrowserKey } from "../shared/keys";
import { MuiKeyboardAdapter } from "../shared/keyboard";
import { MenuItems } from "../shared/menu-items";
import { MuiInteractionReader } from "../shared/reader";
import type { ContextMenuAnchor } from "./anchor";
import { StandardDomIdentityPolicy } from "../runtime/standard-identity";
import { ClosedContextMenuAnchor } from "./closed-anchor";
import { OpenContextMenuAnchor } from "./open-anchor";

export function ContextMenu({
  tree,
  label,
  locale,
  icons,
  theme,
  target,
  children,
}: ContextMenuProps): ReactNode {
  const [anchor, setAnchor] = useState<ContextMenuAnchor>(
    new ClosedContextMenuAnchor(),
  );
  const view = useInteractionBinding(
    tree,
    locale,
    StandardDomIdentityPolicy.instance,
  );
  const reader = useMemo(() => new MuiInteractionReader(tree), [tree]);
  const keyboard = new MuiKeyboardAdapter(
    view.binding,
    reader,
    tree.root.identity,
    theme.direction,
  );
  const open = (top: number, left: number): void => {
    setAnchor(new OpenContextMenuAnchor(top, left));
    view.binding.send(new OpenInteraction(target, tree.root.identity));
  };
  const pointer = (event: MouseEvent): void => {
    event.preventDefault();
    view.binding.modality(InputModality.pointer);
    open(event.clientY, event.clientX);
  };
  const key = (event: KeyboardEvent): void => {
    if (
      event.key !== BrowserKey.contextMenu &&
      !(event.shiftKey && event.key === BrowserKey.f10)
    ) {
      return;
    }
    event.preventDefault();
    view.binding.modality(InputModality.keyboard);
    const bounds = event.currentTarget.getBoundingClientRect();
    open(bounds.bottom, bounds.left);
  };
  const close = (): void => {
    setAnchor(new ClosedContextMenuAnchor());
    view.binding.send(new DismissInteraction());
  };
  return (
    <SirenThemeProvider theme={theme}>
      <span
        id={InteractionDomIdentity.from(target)}
        tabIndex={0}
        onContextMenu={pointer}
        onKeyDown={key}
      >
        {children}
      </span>
      <Menu
        id={InteractionDomIdentity.from(
          tree.root.identity.child(SurfaceIdentityRole.contextSurface),
        )}
        anchorReference="anchorPosition"
        anchorPosition={{ top: anchor.top, left: anchor.left }}
        open={anchor.open && reader.isOpen(view.snapshot)}
        onClose={close}
        onKeyDown={(event) => {
          keyboard.handle(event);
        }}
        variant="menu"
        slotProps={{
          list: {
            dense: true,
            disabledItemsFocusable: true,
            "aria-label": label,
          },
        }}
      >
        <MenuItems
          group={tree.root}
          origin={target}
          binding={view.binding}
          reader={reader}
          icons={icons}
          direction={theme.direction}
        />
      </Menu>
    </SirenThemeProvider>
  );
}
