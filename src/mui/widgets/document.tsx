import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { WidgetNode } from "../../domain/widgets/base";
import { WidgetDocument } from "../../domain/widgets/document";
import type { WidgetContext } from "../../widgets/context";
import { MuiWidgetDensity } from "./density";
import { DiagnosticWidget } from "./diagnostic";
import { UnsupportedWidget } from "./unsupported";
import { WidgetRenderer } from "./renderer";

export interface DocumentWidgetProps {
  readonly context: WidgetContext;
}

export function DocumentWidget({
  context,
}: DocumentWidgetProps): React.JSX.Element {
  if (!(context.node instanceof WidgetDocument)) {
    return <UnsupportedWidget context={context} />;
  }
  const document = context.node;
  const spacing = new MuiWidgetDensity().spacing(context.density);
  const children: readonly WidgetNode[] = [
    ...document.regions,
    ...document.properties,
    ...document.relations,
    ...document.actions,
  ];
  return (
    <Paper
      aria-labelledby={`${context.identities.create(document.identity)}-title`}
      component="main"
      id={context.identities.create(document.identity)}
      square
    >
      <Stack spacing={spacing}>
        <Typography
          component="h1"
          id={`${context.identities.create(document.identity)}-title`}
          variant="h6"
        >
          {document.name.value}
        </Typography>
        {children.map((child) => (
          <WidgetRenderer
            context={context.withNode(child)}
            key={child.identity.value}
          />
        ))}
        {context.snapshot.diagnostics.values.map((diagnostic) => (
          <DiagnosticWidget
            diagnostic={diagnostic}
            key={`${diagnostic.code}:${diagnostic.pointer}`}
          />
        ))}
      </Stack>
    </Paper>
  );
}
