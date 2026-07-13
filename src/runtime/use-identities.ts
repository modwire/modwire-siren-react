import { useContext } from "react";

import type { AccessibilityIdentityFactory } from "../accessibility/identity";
import { SirenIdentityContext } from "./identity-context";

export function useSirenIdentities(): AccessibilityIdentityFactory {
  return useContext(SirenIdentityContext);
}
