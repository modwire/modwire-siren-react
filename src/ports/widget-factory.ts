import type { ReactNode } from "react";

import type { WidgetContext } from "../widgets/context";

export interface WidgetFactory {
  create(context: WidgetContext): ReactNode;
}
