import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SyntheticEvent } from "react";

import { WidgetAction } from "../../domain/widgets/action";
import { WidgetActivation } from "../../widgets/activation";
import type { WidgetContext } from "../../widgets/context";
import { ConfirmationWidget } from "./confirmation";
import { MuiWidgetDensity } from "./density";
import { DiagnosticWidget } from "./diagnostic";
import { ProgressWidget } from "./progress";
import { UnsupportedWidget } from "./unsupported";
import { WidgetRenderer } from "./renderer";

export interface ActionWidgetProps {
  readonly context: WidgetContext;
}

export function ActionWidget({
  context,
}: ActionWidgetProps): React.JSX.Element {
  if (!(context.node instanceof WidgetAction)) {
    return <UnsupportedWidget context={context} />;
  }
  const action = context.node;
  if (action.awaitingConfirmation) {
    return <ConfirmationWidget context={context} />;
  }
  const activation = new WidgetActivation(context);
  const density = new MuiWidgetDensity();
  const submit = (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ): void => {
    event.preventDefault();
    activation.request(action);
  };
  return (
    <Paper
      aria-busy={action.busy}
      component="form"
      id={context.identities.create(action.identity)}
      onSubmit={submit}
      variant="outlined"
    >
      <Stack spacing={density.spacing(context.density)}>
        <Typography component="h3" variant="subtitle2">
          {action.name.value}
        </Typography>
        {action.fields
          .filter((field) => field.visible)
          .map((field) => (
            <WidgetRenderer
              context={context.withNode(field)}
              key={field.identity.value}
            />
          ))}
        {action.diagnostics.map((diagnostic) => (
          <DiagnosticWidget
            diagnostic={diagnostic}
            key={`${diagnostic.code}:${diagnostic.pointer}`}
          />
        ))}
        {action.busy ? <ProgressWidget name={action.name.value} /> : <></>}
        <Button
          disabled={action.busy}
          size={density.control(context.density)}
          type="submit"
          variant="contained"
        >
          {action.confirmationRequired ? "Continue" : action.name.value}
        </Button>
      </Stack>
    </Paper>
  );
}
