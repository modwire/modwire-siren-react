import Box from "@mui/material/Box";

import type { FrameView } from "../../frames/view";
import { WidgetRenderer } from "../widgets/renderer";

export interface FrameContentProps {
  readonly view: FrameView;
}

export function FrameContent({ view }: FrameContentProps): React.JSX.Element {
  return (
    <Box aria-label={view.options.accessibility.content} component="section">
      <WidgetRenderer context={view.widgets} />
    </Box>
  );
}
