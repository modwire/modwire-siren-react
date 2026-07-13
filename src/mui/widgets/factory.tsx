import type { ReactNode } from "react";

import { WidgetAction } from "../../domain/widgets/action";
import { WidgetDocument } from "../../domain/widgets/document";
import { WidgetField } from "../../domain/widgets/field";
import { WidgetProperty } from "../../domain/widgets/property";
import { WidgetRegion } from "../../domain/widgets/region";
import { WidgetRelation } from "../../domain/widgets/relation";
import type { WidgetFactory } from "../../ports/widget-factory";
import type { WidgetContext } from "../../widgets/context";
import { ActionWidget } from "./action";
import { DocumentWidget } from "./document";
import { FieldWidget } from "./field";
import { PropertyWidget } from "./property";
import { RegionWidget } from "./region";
import { RelationWidget } from "./relation";
import { UnsupportedWidget } from "./unsupported";

export class StandardWidgetFactory implements WidgetFactory {
  create(context: WidgetContext): ReactNode {
    if (context.node instanceof WidgetDocument) {
      return <DocumentWidget context={context} />;
    }
    if (context.node instanceof WidgetRegion) {
      return <RegionWidget context={context} />;
    }
    if (context.node instanceof WidgetProperty) {
      return <PropertyWidget context={context} />;
    }
    if (context.node instanceof WidgetRelation) {
      return <RelationWidget context={context} />;
    }
    if (context.node instanceof WidgetAction) {
      return <ActionWidget context={context} />;
    }
    if (context.node instanceof WidgetField) {
      return <FieldWidget context={context} />;
    }
    return <UnsupportedWidget context={context} />;
  }
}
