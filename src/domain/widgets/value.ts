import { SirenReactCode } from "../../errors/code";
import { JsonValue } from "../values/json";

export class WidgetValue {
  private constructor(
    readonly present: boolean,
    private readonly json: JsonValue,
  ) {
    Object.freeze(this);
  }

  static from(value: unknown): WidgetValue {
    return new WidgetValue(
      true,
      JsonValue.adapt(
        value,
        SirenReactCode.widgetValue,
        "Widget value must be JSON-compatible",
      ),
    );
  }

  static absent(): WidgetValue {
    return new WidgetValue(
      false,
      JsonValue.adapt(
        false,
        SirenReactCode.widgetValue,
        "Widget value must be JSON-compatible",
      ),
    );
  }

  value(): unknown {
    return this.json.value();
  }

  text(fallback: string): string {
    return this.json.text(fallback);
  }

  number(fallback: number): number {
    return this.json.number(fallback);
  }

  boolean(fallback: boolean): boolean {
    return this.json.boolean(fallback);
  }

  display(): string {
    if (!this.present) return "";
    return this.json.display();
  }
}
