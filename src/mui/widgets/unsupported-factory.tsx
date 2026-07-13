import type { ReactNode } from "react";

import type { WidgetFactory } from "../../ports/widget-factory";
import type { WidgetContext } from "../../widgets/context";
import { UnsupportedWidget } from "./unsupported";

export class UnsupportedWidgetFactory implements WidgetFactory {
  create(context: WidgetContext): ReactNode {
    return <UnsupportedWidget context={context} />;
  }
}
