import type { ReactNode } from "react";

import type { WidgetContext } from "../../widgets/context";

export interface WidgetFactoryViewProps {
  readonly context: WidgetContext;
}

export function WidgetFactoryView({
  context,
}: WidgetFactoryViewProps): ReactNode {
  return context.registry.resolve(context.node.component).create(context);
}
