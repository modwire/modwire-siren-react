import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { useMemo, type ReactNode } from "react";

import { DismissInteraction } from "../../domain/events/dismiss";
import { OpenInteraction } from "../../domain/events/open";
import { AbsentIcon } from "../../domain/interactions/absent-icon";
import { IconReference } from "../../domain/interactions/icon-reference";
import { StandardIconName } from "../../domain/vocabulary/icon-name";
import { InputModality } from "../../domain/vocabulary/modality";
import { SurfaceIdentityRole } from "../../domain/vocabulary/surface-role";
import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";
import { InteractionShape } from "../../policy/shape";
import type { CommandSurfaceProps } from "../../ports/surface-props";
import { SirenThemeProvider } from "../../theme/provider";
import { InteractionDomIdentity } from "../runtime/dom-identity";
import { useInteractionBinding } from "../runtime/use-binding";
import { InteractionIconSelector } from "../shared/icon-selector";
import { MuiInteractionReader } from "../shared/reader";
import { StandardDomIdentityPolicy } from "../runtime/standard-identity";

export function CommandDial({
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
  if (!InteractionShape.from(tree).dialCompatible) {
    throw new SirenReactError(
      SirenReactCode.interactionSurface,
      "Interaction tree is incompatible with the command dial",
    );
  }
  const origin = tree.root.identity.child(SurfaceIdentityRole.dialTrigger);
  return (
    <SirenThemeProvider theme={theme}>
      <SpeedDial
        ariaLabel={label}
        open={reader.isOpen(view.snapshot)}
        icon={icons.resolve(
          new AbsentIcon(),
          new IconReference(StandardIconName.command),
        )}
        FabProps={{ id: InteractionDomIdentity.from(origin) }}
        onPointerDown={() => {
          view.binding.modality(InputModality.pointer);
        }}
        onTouchStart={() => {
          view.binding.modality(InputModality.touch);
        }}
        onOpen={() => {
          view.binding.send(new OpenInteraction(origin, tree.root.identity));
        }}
        onClose={() => {
          view.binding.send(new DismissInteraction());
        }}
      >
        {reader.leaves().values.map((node) => (
          <SpeedDialAction
            key={node.identity.value}
            icon={icons.resolve(
              node.icon,
              new InteractionIconSelector().select(node),
            )}
            slotProps={{
              tooltip: { title: node.name.value },
              fab: {
                id: InteractionDomIdentity.from(node.identity),
                disabled: !node.availability.activatable,
                "aria-label": node.name.value,
              },
            }}
            onClick={() => {
              view.binding.activate(origin, node.identity);
            }}
          />
        ))}
      </SpeedDial>
    </SirenThemeProvider>
  );
}
