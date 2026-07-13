import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { WidgetProperty } from "../../domain/widgets/property";
import type { WidgetContext } from "../../widgets/context";
import { UnsupportedWidget } from "./unsupported";

export interface PropertyWidgetProps {
  readonly context: WidgetContext;
}

export function PropertyWidget({
  context,
}: PropertyWidgetProps): React.JSX.Element {
  if (!(context.node instanceof WidgetProperty)) {
    return <UnsupportedWidget context={context} />;
  }
  const property = context.node;
  return (
    <ListItem disableGutters id={context.identities.create(property.identity)}>
      <ListItemText
        primary={property.name.value}
        secondary={property.sensitive ? "••••••" : property.value.display()}
      />
    </ListItem>
  );
}
