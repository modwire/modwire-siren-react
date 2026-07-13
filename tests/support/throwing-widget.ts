import type { ReactNode } from "react";

import type { WidgetFactory } from "@modwire/siren-react/extensions";
import type { WidgetContext } from "@modwire/siren-react/widgets";

export class ThrowingWidgetFactory implements WidgetFactory {
  create(context: WidgetContext): ReactNode {
    void context;
    throw new Error("private-renderer-detail");
  }
}
