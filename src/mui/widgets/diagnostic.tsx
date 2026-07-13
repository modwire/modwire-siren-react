import Alert from "@mui/material/Alert";

import type { PresentationDiagnostic } from "../../domain/presentation/diagnostic";
import { DiagnosticSeverity } from "../../domain/vocabulary/diagnostic-severity";

export interface DiagnosticWidgetProps {
  readonly diagnostic: PresentationDiagnostic;
}

export function DiagnosticWidget({
  diagnostic,
}: DiagnosticWidgetProps): React.JSX.Element {
  return (
    <Alert
      severity={
        diagnostic.severity === DiagnosticSeverity.error
          ? DiagnosticSeverity.error
          : DiagnosticSeverity.warning
      }
    >
      {diagnostic.message}
    </Alert>
  );
}
