import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useCallback, useMemo, useState, type ReactNode } from "react";

import { DismissInteraction } from "../../domain/events/dismiss";
import { OpenInteraction } from "../../domain/events/open";
import { AbsentIcon } from "../../domain/interactions/absent-icon";
import { IconReference } from "../../domain/interactions/icon-reference";
import { StandardIconName } from "../../domain/vocabulary/icon-name";
import { InputModality } from "../../domain/vocabulary/modality";
import { SurfaceIdentityRole } from "../../domain/vocabulary/surface-role";
import type { CommandSurfaceProps } from "../../ports/surface-props";
import { SirenThemeProvider } from "../../theme/provider";
import { InteractionDomIdentity } from "../runtime/dom-identity";
import { useInteractionBinding } from "../runtime/use-binding";
import { CascadingMenu } from "../shared/cascade";
import { MuiInteractionReader } from "../shared/reader";

export function CommandMenu({
  tree,
  label,
  locale,
  icons,
  theme,
}: CommandSurfaceProps): ReactNode {
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
  const captureTrigger = useCallback((element: HTMLButtonElement | null) => {
    setTrigger(element);
  }, []);
  const view = useInteractionBinding(tree, locale);
  const reader = useMemo(() => new MuiInteractionReader(tree), [tree]);
  const origin = tree.root.identity.child(SurfaceIdentityRole.menuTrigger);
  return (
    <SirenThemeProvider theme={theme}>
      <Tooltip title={label}>
        <IconButton
          ref={captureTrigger}
          id={InteractionDomIdentity.from(origin)}
          aria-label={label}
          aria-haspopup="menu"
          aria-controls={InteractionDomIdentity.from(
            tree.root.identity.child(SurfaceIdentityRole.menuSurface),
          )}
          aria-expanded={reader.isOpen(view.snapshot)}
          onPointerDown={() => {
            view.binding.modality(InputModality.pointer);
          }}
          onTouchStart={() => {
            view.binding.modality(InputModality.touch);
          }}
          onClick={() => {
            view.binding.send(
              reader.isOpen(view.snapshot)
                ? new DismissInteraction()
                : new OpenInteraction(origin, tree.root.identity),
            );
          }}
        >
          {icons.resolve(
            new AbsentIcon(),
            new IconReference(StandardIconName.menu),
          )}
        </IconButton>
      </Tooltip>
      <CascadingMenu
        anchor={trigger}
        group={tree.root}
        origin={origin}
        binding={view.binding}
        reader={reader}
        icons={icons}
        direction={theme.direction}
      />
    </SirenThemeProvider>
  );
}
