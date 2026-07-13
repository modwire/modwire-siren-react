import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";

export class AccessibilityPolicy {
  constructor(
    readonly application: string,
    readonly navigation: string,
    readonly commands: string,
    readonly content: string,
    readonly status: string,
    readonly inspector: string,
    readonly search: string,
  ) {
    for (const name of [
      application,
      navigation,
      commands,
      content,
      status,
      inspector,
      search,
    ]) {
      if (name.trim() === "") {
        throw new SirenReactError(
          SirenReactCode.optionsInvalid,
          "Accessibility names cannot be empty",
        );
      }
    }
    Object.freeze(this);
  }
}
