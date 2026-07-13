import { SirenReactError } from "../../errors/error";

export class JsonValue {
  private constructor(private readonly raw: unknown) {
    Object.freeze(this);
  }

  static adapt(value: unknown, code: string, message: string): JsonValue {
    return new JsonValue(JsonValue.freeze(value, code, message, new Set()));
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
    if (typeof this.raw === "string") return this.raw;
    if (typeof this.raw === "number" || typeof this.raw === "boolean") {
      return String(this.raw);
    }
    return JSON.stringify(this.raw);
  }

  private static freeze(
    value: unknown,
    code: string,
    message: string,
    ancestors: Set<object>,
  ): unknown {
    if (value === null) return value;
    if (typeof value === "string" || typeof value === "boolean") return value;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (Array.isArray(value)) {
      if (ancestors.has(value)) JsonValue.invalid(code, message);
      ancestors.add(value);
      try {
        return Object.freeze(
          Array.from(value, (member) =>
            JsonValue.freeze(member, code, message, ancestors),
          ),
        );
      } finally {
        ancestors.delete(value);
      }
    }
    if (
      typeof value === "object" &&
      Object.getPrototypeOf(value) === Object.prototype
    ) {
      if (ancestors.has(value)) JsonValue.invalid(code, message);
      ancestors.add(value);
      const result: Record<string, unknown> = {};
      try {
        for (const name of Object.keys(value)) {
          const descriptor = Object.getOwnPropertyDescriptor(value, name);
          if (descriptor === undefined || !("value" in descriptor)) {
            JsonValue.invalid(code, message);
          }
          Object.defineProperty(result, name, {
            configurable: false,
            enumerable: true,
            value: JsonValue.freeze(descriptor.value, code, message, ancestors),
            writable: false,
          });
        }
        return Object.freeze(result);
      } finally {
        ancestors.delete(value);
      }
    }
    return JsonValue.invalid(code, message);
  }

  private static invalid(code: string, message: string): never {
    throw new SirenReactError(code, message);
  }
}
