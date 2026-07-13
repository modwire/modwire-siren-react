import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";

export class TypeaheadPolicy {
  constructor(
    readonly resetDelay: number,
    readonly resultLimit: number,
  ) {
    if (!Number.isFinite(resetDelay) || resetDelay < 0) {
      throw new SirenReactError(
        SirenReactCode.interactionTiming,
        "Typeahead reset delay must be finite and non-negative",
      );
    }
    if (!Number.isInteger(resultLimit) || resultLimit < 1) {
      throw new SirenReactError(
        SirenReactCode.interactionTiming,
        "Typeahead result limit must be a positive integer",
      );
    }
    Object.freeze(this);
  }
}
