import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";

export class WidgetValue {
  private constructor(
    readonly present: boolean,
    private readonly raw: unknown,
  ) {
    Object.freeze(this);
  }

  static from(value: unknown): WidgetValue {
    return new WidgetValue(true, WidgetValue.freeze(value));
  }

  static absent(): WidgetValue {
    return new WidgetValue(false, false);
  }

  value(): unknown {
    return this.raw;
  }

  text(fallback: string): string {
    return typeof this.raw === "string" ? this.raw : fallback;
  }

  number(fallback: number): number {
    return typeof this.raw === "number" && Number.isFinite(this.raw)
      ? this.raw
      : fallback;
  }

  boolean(fallback: boolean): boolean {
    return typeof this.raw === "boolean" ? this.raw : fallback;
  }

  display(): string {
    if (!this.present) return "";
    if (typeof this.raw === "string") return this.raw;
    if (typeof this.raw === "number" || typeof this.raw === "boolean") {
      return String(this.raw);
    }
    return JSON.stringify(this.raw);
  }

  private static freeze(value: unknown): unknown {
    if (value === null) return value;
    if (typeof value === "string" || typeof value === "boolean") return value;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (Array.isArray(value)) {
      return Object.freeze(value.map((member) => WidgetValue.freeze(member)));
    }
    if (
      typeof value === "object" &&
      Object.getPrototypeOf(value) === Object.prototype
    ) {
      const result: Record<string, unknown> = {};
      for (const [name, member] of Object.entries(value)) {
        result[name] = WidgetValue.freeze(member);
      }
      return Object.freeze(result);
    }
    throw new SirenReactError(
      SirenReactCode.widgetValue,
      "Widget value must be JSON-compatible",
    );
  }
}
