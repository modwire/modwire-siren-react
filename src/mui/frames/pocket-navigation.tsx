import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import { SurfaceIdentityRole } from "../../domain/vocabulary/surface-role";
import { PocketDestinations } from "../../frames/pocket-destinations";
import type { FrameView } from "../../frames/view";
import { useInteractionBinding } from "../runtime/use-binding";
import { InteractionIconSelector } from "../shared/icon-selector";
import { StandardDomIdentityPolicy } from "../runtime/standard-identity";
import { InteractionDomIdentity } from "../runtime/dom-identity";

export interface PocketNavigationProps {
  readonly view: FrameView;
}

export function PocketNavigation({
  view,
}: PocketNavigationProps): React.JSX.Element {
  const binding = useInteractionBinding(
    view.interactions,
    view.options.locale,
    StandardDomIdentityPolicy.instance,
  ).binding;
  const origin = view.interactions.root.identity.child(
    SurfaceIdentityRole.pocketNavigation,
  );
  const destinations = new PocketDestinations().select(view.interactions);
  return (
    <BottomNavigation
      aria-label={view.options.accessibility.navigation}
      component="div"
      showLabels
    >
      {destinations.map((node) => (
        <BottomNavigationAction
          disabled={!node.availability.activatable}
          icon={view.options.icons.resolve(
            node.icon,
            new InteractionIconSelector().select(node),
          )}
          key={node.identity.value}
          id={InteractionDomIdentity.from(node.identity)}
          label={node.name.value}
          onClick={() => {
            binding.activate(origin, node.identity);
          }}
        />
      ))}
    </BottomNavigation>
  );
}
