import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";

export class SirenThemeMetrics {
  constructor(
    readonly compactControl: number,
    readonly touchTarget: number,
    readonly railWidth: number,
    readonly nestingOffset: number,
    readonly focusRing: number,
  ) {
    for (const value of [
      compactControl,
      touchTarget,
      railWidth,
      nestingOffset,
      focusRing,
    ]) {
      if (!Number.isFinite(value) || value <= 0) {
        throw new SirenReactError(
          SirenReactCode.themeValue,
          "Theme metrics must be finite positive numbers",
        );
      }
    }
    Object.freeze(this);
  }
}
