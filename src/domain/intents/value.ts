import { SirenReactCode } from "../../errors/code";
import { JsonValue } from "../values/json";

export class InteractionValue {
  private constructor(private readonly json: JsonValue) {
    Object.freeze(this);
  }

  static from(value: unknown): InteractionValue {
    return new InteractionValue(
      JsonValue.adapt(
        value,
        SirenReactCode.interactionValue,
        "Interaction value must be JSON-compatible",
      ),
    );
  }

  value(): unknown {
    return this.json.value();
  }
}
