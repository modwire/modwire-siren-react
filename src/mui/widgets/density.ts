import { InteractionDensity } from "../../domain/vocabulary/density";

export class MuiWidgetDensity {
  control(density: InteractionDensity): "small" | "medium" {
    return density === InteractionDensity.compact ? "small" : "medium";
  }

  spacing(density: InteractionDensity): number {
    return density === InteractionDensity.compact ? 1 : 2;
  }
}
