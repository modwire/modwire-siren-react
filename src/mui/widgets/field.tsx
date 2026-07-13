import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";

import { WidgetField } from "../../domain/widgets/field";
import { WidgetActivation } from "../../widgets/activation";
import type { WidgetContext } from "../../widgets/context";
import { FieldInputPolicy } from "../../widgets/input-policy";
import { MuiWidgetDensity } from "./density";
import { UnsupportedWidget } from "./unsupported";

export interface FieldWidgetProps {
  readonly context: WidgetContext;
}

export function FieldWidget({ context }: FieldWidgetProps): React.JSX.Element {
  if (!(context.node instanceof WidgetField)) {
    return <UnsupportedWidget context={context} />;
  }
  const field = context.node;
  const policy = new FieldInputPolicy();
  const activation = new WidgetActivation(context);
  const size = new MuiWidgetDensity().control(context.density);
  if (!field.visible) return <span aria-hidden hidden />;
  if (!policy.supported(field)) return <UnsupportedWidget context={context} />;
  if (policy.hidden(field)) {
    return <span aria-hidden hidden />;
  }
  if (policy.toggle(field)) {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={field.value.boolean(false)}
            disabled={!field.enabled || field.busy}
            onChange={(event) => {
              activation.field(field, event.target.checked);
            }}
            required={field.required}
          />
        }
        label={field.name.value}
      />
    );
  }
  return (
    <TextField
      disabled={!field.enabled || field.busy}
      fullWidth
      id={context.identities.create(field.identity)}
      label={field.name.value}
      multiline={policy.multiline(field)}
      onChange={(event) => {
        activation.field(field, policy.change(field, event.target.value));
      }}
      required={field.required}
      size={size}
      type={policy.type(field)}
      value={policy.value(field)}
    />
  );
}
