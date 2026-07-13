import { SirenThemeColors } from "./colors";
import { SirenThemeMetrics } from "./metrics";
import { SirenThemeMotion } from "./motion";
import { SirenTheme } from "./theme";
import { LayoutDirection } from "../domain/vocabulary/directionality";

export class StandardSirenTheme {
  create(): SirenTheme {
    return new SirenTheme(
      new SirenThemeMetrics(32, 44, 56, 16, 2),
      new SirenThemeMotion(120, 180, "cubic-bezier(0.2, 0, 0, 1)"),
      new SirenThemeColors(
        "#1565c0",
        "#2e7d32",
        "#ed6c02",
        "#d32f2f",
        "#005fcc",
      ),
      LayoutDirection.leftToRight,
    );
  }
}
