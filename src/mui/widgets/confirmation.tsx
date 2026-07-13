import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SyntheticEvent } from "react";

import { WidgetAction } from "../../domain/widgets/action";
import { WidgetActivation } from "../../widgets/activation";
import type { WidgetContext } from "../../widgets/context";
import { AcknowledgementWidget } from "./acknowledgement";
import { MuiWidgetDensity } from "./density";
import { UnsupportedWidget } from "./unsupported";

export interface ConfirmationWidgetProps {
  readonly context: WidgetContext;
}

export function ConfirmationWidget({
  context,
}: ConfirmationWidgetProps): React.JSX.Element {
  if (!(context.node instanceof WidgetAction)) {
    return <UnsupportedWidget context={context} />;
  }
  const action = context.node;
  const activation = new WidgetActivation(context);
  const density = new MuiWidgetDensity();
  const submit = (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ): void => {
    event.preventDefault();
    const entry = new FormData(event.currentTarget).get("acknowledgement");
    activation.confirm(action, typeof entry === "string" ? entry : "");
  };
  return (
    <Paper
      aria-label={`Confirm ${action.name.value}`}
      component="form"
      onSubmit={submit}
      role="group"
      variant="outlined"
    >
      <Stack spacing={density.spacing(context.density)}>
        <Typography component="h3" variant="subtitle2">
          {`Confirm ${action.name.value}`}
        </Typography>
        {action.acknowledgement === "" ? (
          <span>{`This action requires confirmation.`}</span>
        ) : (
          <AcknowledgementWidget
            acknowledgement={action.acknowledgement}
            disabled={action.busy}
            density={context.density}
          />
        )}
        <Button
          disabled={action.busy}
          onClick={() => {
            activation.cancel(action);
          }}
          size={density.control(context.density)}
          type="button"
        >
          Cancel
        </Button>
        <Button
          disabled={action.busy}
          size={density.control(context.density)}
          type="submit"
          variant="contained"
        >
          Confirm
        </Button>
      </Stack>
    </Paper>
  );
}
