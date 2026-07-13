import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";

export class AccessibleName {
  readonly value: string;

  constructor(value: string) {
    this.value = value.trim();
    if (this.value === "") {
      throw new SirenReactError(
        SirenReactCode.interactionName,
        "Interaction accessible name cannot be empty",
      );
    }
    Object.freeze(this);
  }
}
