import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";

export class HoverPolicy {
  constructor(
    readonly openDelay: number,
    readonly closeDelay: number,
  ) {
    this.assertDelay(openDelay);
    this.assertDelay(closeDelay);
    Object.freeze(this);
  }

  private assertDelay(delay: number): void {
    if (!Number.isFinite(delay) || delay < 0) {
      throw new SirenReactError(
        SirenReactCode.interactionTiming,
        "Hover delay must be finite and non-negative",
      );
    }
  }
}
