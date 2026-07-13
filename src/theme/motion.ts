import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";

export class SirenThemeMotion {
  constructor(
    readonly fast: number,
    readonly standard: number,
    readonly easing: string,
  ) {
    if (
      !Number.isFinite(fast) ||
      fast < 0 ||
      !Number.isFinite(standard) ||
      standard < 0 ||
      easing.trim() === ""
    ) {
      throw new SirenReactError(
        SirenReactCode.themeValue,
        "Theme motion values are invalid",
      );
    }
    Object.freeze(this);
  }
}
