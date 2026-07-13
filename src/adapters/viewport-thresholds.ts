import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";

export class ViewportThresholds {
  constructor(
    readonly compact: number,
    readonly expanded: number,
  ) {
    if (
      !Number.isFinite(compact) ||
      !Number.isFinite(expanded) ||
      compact <= 0 ||
      expanded <= compact
    ) {
      throw new SirenReactError(
        SirenReactCode.optionsInvalid,
        "Viewport thresholds must be finite and ordered",
      );
    }
    Object.freeze(this);
  }
}
