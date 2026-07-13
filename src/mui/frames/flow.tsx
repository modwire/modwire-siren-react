import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import { InteractionPlacement } from "../../domain/interactions/placement";
import { FrameFamily } from "../../domain/vocabulary/frame";
import { SurfacePurpose } from "../../domain/vocabulary/purpose";
import type { FrameProps } from "../../frames/props";
import { useFrameView } from "../../frames/use-view";
import { FrameContent } from "./content";
import { FrameHeader } from "./header";
import { FrameStatus } from "./status";
import { FrameSurface } from "./surface";
import { FrameTheme } from "./theme";

export function FlowFrame({ options }: FrameProps): React.JSX.Element {
  const view = useFrameView(FrameFamily.flow, options);
  return (
    <FrameTheme options={options}>
      <Box aria-label={options.accessibility.application}>
        <FrameHeader position="sticky" view={view}>
          <span aria-hidden />
        </FrameHeader>
        <FrameContent view={view} />
        <Paper
          aria-label={options.accessibility.commands}
          component="aside"
          square
          style={{
            bottom: 0,
            position: options.frames.flow.keepActionsVisible
              ? "sticky"
              : "static",
          }}
        >
          <FrameSurface
            label={options.accessibility.commands}
            placement={InteractionPlacement.entity}
            purpose={SurfacePurpose.application}
            view={view}
          />
        </Paper>
        <FrameStatus view={view} />
      </Box>
    </FrameTheme>
  );
}
