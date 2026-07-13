import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { useMemo, type ReactNode } from "react";

import { InteractionDivider } from "../../domain/interactions/divider";
import type { CommandSurfaceProps } from "../../ports/surface-props";
import { SirenThemeProvider } from "../../theme/provider";
import { useInteractionBinding } from "../runtime/use-binding";
import { MuiInteractionReader } from "../shared/reader";
import { MuiKeyboardAdapter } from "../shared/keyboard";
import { CommandRailItem } from "./rail-item";
import { StandardDomIdentityPolicy } from "../runtime/standard-identity";

export function CommandRail({
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
  const keyboard = new MuiKeyboardAdapter(
    view.binding,
    reader,
    tree.root.identity,
    theme.direction,
  );
  return (
    <SirenThemeProvider theme={theme}>
      <Drawer variant="permanent">
        <List
          component="nav"
          aria-label={label}
          onKeyDown={(event) => {
            keyboard.handle(event);
          }}
          style={{ width: theme.metrics.railWidth }}
        >
          {tree.root.children.values.map((node) =>
            node instanceof InteractionDivider ? (
              <Divider key={node.identity.value} />
            ) : (
              <CommandRailItem
                key={node.identity.value}
                node={node}
                binding={view.binding}
                reader={reader}
                icons={icons}
                direction={theme.direction}
              />
            ),
          )}
        </List>
      </Drawer>
    </SirenThemeProvider>
  );
}
