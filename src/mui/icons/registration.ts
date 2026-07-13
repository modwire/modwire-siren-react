import type { IconFactory } from "../../ports/icon-factory";

export class IconRegistration {
  constructor(
    readonly key: string,
    readonly factory: IconFactory,
  ) {
    Object.freeze(this);
  }
}
