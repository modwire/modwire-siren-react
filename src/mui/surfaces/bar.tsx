import Toolbar from "@mui/material/Toolbar";
import { useMemo, type ReactNode } from "react";

import { InteractionDivider } from "../../domain/interactions/divider";
import type { CommandSurfaceProps } from "../../ports/surface-props";
import { SirenThemeProvider } from "../../theme/provider";
import { useInteractionBinding } from "../runtime/use-binding";
import { MuiBarKeyboardAdapter } from "../shared/bar-keyboard";
import { MuiInteractionReader } from "../shared/reader";
import { CommandBarItem } from "./bar-item";
import { StandardDomIdentityPolicy } from "../runtime/standard-identity";

export function CommandBar({
  tree,
  label,
  locale,
  icons,
  theme,
}: CommandSurfaceProps): ReactNode {
  const view = useInteractionBinding(
    tree,
    locale,
    StandardDomIdentityPolicy.instance,
  );
  const reader = useMemo(() => new MuiInteractionReader(tree), [tree]);
  const keyboard = new MuiBarKeyboardAdapter(
    view.binding,
    reader,
    theme.direction,
  );
  return (
    <SirenThemeProvider theme={theme}>
      <Toolbar
        variant="dense"
        role="menubar"
        aria-label={label}
        onKeyDown={(event) => {
          keyboard.handle(event);
        }}
      >
        {tree.root.children.values.map((node) =>
          node instanceof InteractionDivider ? (
            <span key={node.identity.value} role="separator" />
          ) : (
            <CommandBarItem
              key={node.identity.value}
              node={node}
              binding={view.binding}
              reader={reader}
              icons={icons}
              direction={theme.direction}
            />
          ),
        )}
      </Toolbar>
    </SirenThemeProvider>
  );
}
