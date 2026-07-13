import { createContext } from "react";

import { AccessibilityIdentityFactory } from "../accessibility/identity";

export const SirenIdentityContext = createContext(
  AccessibilityIdentityFactory.global,
);
