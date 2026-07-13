import type { ReactElement } from "react";

import type { IconFactory } from "../../ports/icon-factory";

export class ElementIconFactory implements IconFactory {
  constructor(private readonly icon: ReactElement) {}

  create(): ReactElement {
    return this.icon;
  }
}
