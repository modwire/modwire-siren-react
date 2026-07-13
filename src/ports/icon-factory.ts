import type { ReactElement } from "react";

export interface IconFactory {
  create(): ReactElement;
}
