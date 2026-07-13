import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

import type { FrameView } from "../../frames/view";
import { DiagnosticSeverity } from "../../domain/vocabulary/diagnostic-severity";

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
        <Alert severity={DiagnosticSeverity.info}>
          {view.presentation.announcement}
        </Alert>
      )}
    </Box>
  );
}
