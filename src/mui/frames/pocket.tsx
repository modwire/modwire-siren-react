import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import { InteractionPlacement } from "../../domain/interactions/placement";
import { FrameFamily } from "../../domain/vocabulary/frame";
import { SurfacePurpose } from "../../domain/vocabulary/purpose";
import type { FrameProps } from "../../frames/props";
import { PocketNavigationPolicy } from "../../frames/pocket-navigation";
import { useFrameView } from "../../frames/use-view";
import { FrameContent } from "./content";
import { FrameHeader } from "./header";
import { FrameStatus } from "./status";
import { FrameSurface } from "./surface";
import { FrameTheme } from "./theme";
import { PocketNavigation } from "./pocket-navigation";

export function PocketFrame({ options }: FrameProps): React.JSX.Element {
  const view = useFrameView(FrameFamily.pocket, options);
  const persistentNavigation = new PocketNavigationPolicy().compatible(
    view.interactions,
    options.frames.pocket.maximumDestinations,
  );
  return (
    <FrameTheme options={options}>
      <Box aria-label={options.accessibility.application}>
        <FrameHeader position="sticky" view={view}>
          <span aria-hidden />
        </FrameHeader>
        <FrameContent view={view} />
        <Paper
          aria-label={options.accessibility.navigation}
          component="nav"
          square
          style={{ bottom: 0, position: "sticky" }}
        >
          {persistentNavigation ? (
            <PocketNavigation view={view} />
          ) : (
            <FrameSurface
              label={options.accessibility.navigation}
              placement={InteractionPlacement.navigation}
              purpose={SurfacePurpose.application}
              view={view}
            />
          )}
        </Paper>
        <FrameStatus view={view} />
      </Box>
    </FrameTheme>
  );
}
