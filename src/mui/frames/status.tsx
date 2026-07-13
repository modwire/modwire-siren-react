import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

import type { FrameView } from "../../frames/view";

export interface FrameStatusProps {
  readonly view: FrameView;
}

export function FrameStatus({ view }: FrameStatusProps): React.JSX.Element {
  return (
    <Box
      aria-label={view.options.accessibility.status}
      aria-live="polite"
      component="footer"
    >
      {view.presentation.announcement === "" ? (
        <span aria-hidden />
      ) : (
        <Alert severity="info">{view.presentation.announcement}</Alert>
      )}
    </Box>
  );
}
