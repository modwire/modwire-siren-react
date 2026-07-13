import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";

export class SirenThemeColors {
  constructor(
    readonly operation: string,
    readonly success: string,
    readonly warning: string,
    readonly failure: string,
    readonly focus: string,
  ) {
    if (
      [operation, success, warning, failure, focus].some(
        (value) => value.trim() === "",
      )
    ) {
      throw new SirenReactError(
        SirenReactCode.themeValue,
        "Theme colors cannot be empty",
      );
    }
    Object.freeze(this);
  }
}
