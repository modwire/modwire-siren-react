import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";

export class InteractionValue {
  private constructor(private readonly raw: unknown) {
    Object.freeze(this);
  }

  static from(value: unknown): InteractionValue {
    return new InteractionValue(InteractionValue.freeze(value));
  }

  value(): unknown {
    return this.raw;
  }

  private static freeze(value: unknown): unknown {
    if (value === null) return value;
    if (typeof value === "string" || typeof value === "boolean") return value;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (Array.isArray(value)) {
      return Object.freeze(value.map((item) => InteractionValue.freeze(item)));
    }
    if (
      typeof value === "object" &&
      Object.getPrototypeOf(value) === Object.prototype
    ) {
      const result: Record<string, unknown> = {};
      for (const [name, member] of Object.entries(value)) {
        result[name] = InteractionValue.freeze(member);
      }
      return Object.freeze(result);
    }
    throw new SirenReactError(
      SirenReactCode.interactionValue,
      "Interaction value must be JSON-compatible",
    );
  }
}
