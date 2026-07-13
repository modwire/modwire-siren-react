import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import type { WidgetContext } from "../../widgets/context";
import { DiagnosticWidget } from "./diagnostic";

export interface UnsupportedWidgetProps {
  readonly context: WidgetContext;
}

export function UnsupportedWidget({
  context,
}: UnsupportedWidgetProps): React.JSX.Element {
  return (
    <Stack role="status" spacing={1}>
      <Alert severity="warning">
        {`Unsupported ${context.node.kind}: ${context.node.name.value}`}
      </Alert>
      {context.node.diagnostics.map((diagnostic) => (
        <DiagnosticWidget
          diagnostic={diagnostic}
          key={`${diagnostic.code}:${diagnostic.pointer}`}
        />
      ))}
    </Stack>
  );
}
