import { FieldWidget } from "../domain/vocabulary/field-widget";
import { HtmlInputType } from "../domain/vocabulary/input-type";
import type { WidgetField } from "../domain/widgets/field";

export class FieldInputPolicy {
  supported(field: WidgetField): boolean {
    return ![
      FieldWidget.select,
      FieldWidget.multiSelect,
      FieldWidget.file,
    ].includes(field.widget);
  }

  toggle(field: WidgetField): boolean {
    return (
      field.widget === FieldWidget.toggle ||
      (field.widget === FieldWidget.automatic &&
        field.fieldType === HtmlInputType.checkbox)
    );
  }

  hidden(field: WidgetField): boolean {
    return field.widget === FieldWidget.hidden;
  }

  multiline(field: WidgetField): boolean {
    return (
      field.widget === FieldWidget.textarea || field.widget === FieldWidget.code
    );
  }

  type(field: WidgetField): string {
    if (field.widget === FieldWidget.number) return HtmlInputType.number;
    if (field.widget === FieldWidget.date) return HtmlInputType.date;
    if (field.widget === FieldWidget.dateTime) return HtmlInputType.dateTime;
    if (
      field.widget === FieldWidget.automatic &&
      [
        HtmlInputType.number,
        HtmlInputType.date,
        HtmlInputType.dateTime,
        HtmlInputType.password,
        HtmlInputType.email,
        HtmlInputType.telephone,
        HtmlInputType.time,
        HtmlInputType.url,
      ].includes(field.fieldType)
    ) {
      return field.fieldType;
    }
    return HtmlInputType.text;
  }

  value(field: WidgetField): string {
    return field.value.display();
  }

  change(field: WidgetField, value: string): unknown {
    if (this.type(field) !== HtmlInputType.number || value === "") return value;
    const number = Number(value);
    return Number.isFinite(number) ? number : value;
  }
}
