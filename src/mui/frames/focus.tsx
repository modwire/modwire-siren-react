import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";

import { InteractionPlacement } from "../../domain/interactions/placement";
import { FrameFamily } from "../../domain/vocabulary/frame";
import { SurfacePurpose } from "../../domain/vocabulary/purpose";
import type { FrameProps } from "../../frames/props";
import { useFrameView } from "../../frames/use-view";
import { FrameContent } from "./content";
import { FrameStatus } from "./status";
import { FrameSurface } from "./surface";
import { FrameTheme } from "./theme";
import { FrameHeader } from "./header";

export function FocusFrame({ options }: FrameProps): React.JSX.Element {
  const view = useFrameView(FrameFamily.focus, options);
  const configuration = options.frames.focus;
  const scrollTriggered = useScrollTrigger();
  return (
    <FrameTheme options={options}>
      <Box aria-label={options.accessibility.application}>
        <Slide
          appear={false}
          direction="down"
          in={!configuration.hideChromeOnReadingScroll || !scrollTriggered}
        >
          <div>
            <FrameHeader position="sticky" view={view}>
              <FrameSurface
                label={options.accessibility.commands}
                placement={InteractionPlacement.entity}
                purpose={SurfacePurpose.application}
                view={view}
              />
            </FrameHeader>
          </div>
        </Slide>
        <FrameContent view={view} />
        <FrameStatus view={view} />
      </Box>
    </FrameTheme>
  );
}
