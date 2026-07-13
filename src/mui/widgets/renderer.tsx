import { WidgetBoundary } from "../../widgets/boundary";
import type { WidgetContext } from "../../widgets/context";
import { WidgetFactoryView } from "./factory-view";
import { UnsupportedWidget } from "./unsupported";

export interface WidgetRendererProps {
  readonly context: WidgetContext;
}

export function WidgetRenderer({
  context,
}: WidgetRendererProps): React.JSX.Element {
  const fallback = <UnsupportedWidget context={context} />;
  return (
    <WidgetBoundary
      fallback={fallback}
      observer={context.observer}
      revision={context.snapshot.revision}
    >
      <WidgetFactoryView context={context} />
    </WidgetBoundary>
  );
}
