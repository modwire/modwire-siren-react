import Box from "@mui/material/Box";

import { InteractionPlacement } from "../../domain/interactions/placement";
import { FrameFamily } from "../../domain/vocabulary/frame";
import { SurfacePurpose } from "../../domain/vocabulary/purpose";
import { ViewportClass } from "../../domain/vocabulary/viewport";
import type { FrameProps } from "../../frames/props";
import { useFrameView } from "../../frames/use-view";
import { FrameContent } from "./content";
import { FrameInspector } from "./inspector";
import { FrameHeader } from "./header";
import { FrameStatus } from "./status";
import { FrameSurface } from "./surface";
import { FrameTheme } from "./theme";

export function WorkbenchFrame({ options }: FrameProps): React.JSX.Element {
  const view = useFrameView(FrameFamily.workbench, options);
  const expanded = view.viewport === ViewportClass.expanded;
  return (
    <FrameTheme options={options}>
      <Box aria-label={options.accessibility.application}>
        <FrameHeader position="sticky" view={view}>
          <FrameSurface
            label={options.accessibility.search}
            placement={InteractionPlacement.none}
            purpose={SurfacePurpose.search}
            view={view}
          />
          {!expanded ? (
            <FrameSurface
              label={options.accessibility.navigation}
              placement={InteractionPlacement.navigation}
              purpose={SurfacePurpose.application}
              view={view}
            />
          ) : (
            <span aria-hidden />
          )}
        </FrameHeader>
        <Box component="section" display="flex">
          {expanded ? (
            <FrameSurface
              label={options.accessibility.navigation}
              placement={InteractionPlacement.navigation}
              purpose={SurfacePurpose.application}
              view={view}
            />
          ) : (
            <span aria-hidden />
          )}
          <Box
            component="section"
            flex="1 1 auto"
            marginLeft={
              expanded ? `${String(options.theme.metrics.railWidth)}px` : 0
            }
            minWidth={0}
          >
            <FrameContent view={view} />
          </Box>
          <FrameInspector view={view} />
        </Box>
        <FrameStatus view={view} />
      </Box>
    </FrameTheme>
  );
}
