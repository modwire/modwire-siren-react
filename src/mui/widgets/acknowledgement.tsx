import TextField from "@mui/material/TextField";

import type { InteractionDensity } from "../../domain/vocabulary/density";
import { MuiWidgetDensity } from "./density";

export interface AcknowledgementWidgetProps {
  readonly acknowledgement: string;
  readonly disabled: boolean;
  readonly density: InteractionDensity;
}

export function AcknowledgementWidget({
  acknowledgement,
  disabled,
  density,
}: AcknowledgementWidgetProps): React.JSX.Element {
  return (
    <TextField
      autoComplete="off"
      disabled={disabled}
      fullWidth
      helperText={acknowledgement}
      label="Acknowledgement"
      name="acknowledgement"
      required
      size={new MuiWidgetDensity().control(density)}
    />
  );
}
