import { CancelActionIntent } from "../domain/intents/cancel-action";
import { ConfirmActionIntent } from "../domain/intents/confirm-action";
import { LoadRelationIntent } from "../domain/intents/load-relation";
import { RequestActionIntent } from "../domain/intents/request-action";
import { SetFieldIntent } from "../domain/intents/set-field";
import type { WidgetAction } from "../domain/widgets/action";
import type { WidgetField } from "../domain/widgets/field";
import type { WidgetRelation } from "../domain/widgets/relation";
import type { WidgetContext } from "./context";
import { RendererReporter } from "../errors/reporter";

export class WidgetActivation {
  constructor(private readonly context: WidgetContext) {}

  relation(relation: WidgetRelation): void {
    this.activate(new LoadRelationIntent(relation.identity));
  }

  request(action: WidgetAction): void {
    this.activate(new RequestActionIntent(action.identity));
  }

  confirm(action: WidgetAction, acknowledgement: string): void {
    this.activate(new ConfirmActionIntent(action.identity, acknowledgement));
  }

  cancel(action: WidgetAction): void {
    this.activate(new CancelActionIntent(action.identity));
  }

  field(field: WidgetField, value: unknown): void {
    this.activate(new SetFieldIntent(field.action, field.field, value));
  }

  private activate(
    intent: Parameters<WidgetContext["activator"]["activate"]>[0],
  ): void {
    void this.context.activator.activate(intent).catch(() => {
      new RendererReporter(this.context.observer).failure(
        "Widget activation failed",
      );
    });
  }
}
