import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";

export class PocketFrameConfiguration {
  constructor(readonly maximumDestinations: number) {
    if (
      !Number.isInteger(maximumDestinations) ||
      maximumDestinations < 3 ||
      maximumDestinations > 5
    ) {
      throw new SirenReactError(
        SirenReactCode.optionsInvalid,
        "Pocket destination limit must be between three and five",
      );
    }
    Object.freeze(this);
  }
}
