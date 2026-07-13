import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { WidgetRegion } from "../../domain/widgets/region";
import type { WidgetNode } from "../../domain/widgets/base";
import type { WidgetContext } from "../../widgets/context";
import { MuiWidgetDensity } from "./density";
import { DiagnosticWidget } from "./diagnostic";
import { UnsupportedWidget } from "./unsupported";
import { WidgetRenderer } from "./renderer";

export interface RegionWidgetProps {
  readonly context: WidgetContext;
}

export function RegionWidget({
  context,
}: RegionWidgetProps): React.JSX.Element {
  if (!(context.node instanceof WidgetRegion)) {
    return <UnsupportedWidget context={context} />;
  }
  const region = context.node;
  const spacing = new MuiWidgetDensity().spacing(context.density);
  const children: readonly WidgetNode[] = [
    ...region.properties,
    ...region.relations,
    ...region.actions,
  ];
  return (
    <Card
      component="section"
      id={context.identities.create(region.identity)}
      variant="outlined"
    >
      <CardContent>
        <Typography component="h2" variant="subtitle1">
          {region.name.value}
        </Typography>
        <Divider />
        <Stack spacing={spacing}>
          {children.map((child) => (
            <WidgetRenderer
              context={context.withNode(child)}
              key={child.identity.value}
            />
          ))}
          {region.diagnostics.map((diagnostic) => (
            <DiagnosticWidget
              diagnostic={diagnostic}
              key={`${diagnostic.code}:${diagnostic.pointer}`}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
