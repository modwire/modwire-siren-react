import type { SirenThemeColors } from "./colors";
import type { SirenThemeMetrics } from "./metrics";
import type { SirenThemeMotion } from "./motion";
import type { LayoutDirection } from "../domain/vocabulary/directionality";

export class SirenTheme {
  constructor(
    readonly metrics: SirenThemeMetrics,
    readonly motion: SirenThemeMotion,
    readonly colors: SirenThemeColors,
    readonly direction: LayoutDirection,
  ) {
    Object.freeze(this);
  }
}
