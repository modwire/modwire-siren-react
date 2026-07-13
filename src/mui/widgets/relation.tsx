import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { WidgetRelation } from "../../domain/widgets/relation";
import { WidgetActivation } from "../../widgets/activation";
import type { WidgetContext } from "../../widgets/context";
import { MuiWidgetDensity } from "./density";
import { UnsupportedWidget } from "./unsupported";

export interface RelationWidgetProps {
  readonly context: WidgetContext;
}

export function RelationWidget({
  context,
}: RelationWidgetProps): React.JSX.Element {
  if (!(context.node instanceof WidgetRelation)) {
    return <UnsupportedWidget context={context} />;
  }
  const relation = context.node;
  const activation = new WidgetActivation(context);
  const size = new MuiWidgetDensity().control(context.density);
  return (
    <Button
      aria-busy={relation.busy}
      disabled={relation.busy}
      id={context.identities.create(relation.identity)}
      onClick={() => {
        activation.relation(relation);
      }}
      size={size}
    >
      {relation.busy ? <CircularProgress size={16} /> : <></>}
      {relation.name.value}
    </Button>
  );
}
