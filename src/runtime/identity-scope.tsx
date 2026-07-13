import { useId, useMemo, type ReactNode } from "react";

import { AccessibilityIdentityFactory } from "../accessibility/identity";
import { SirenIdentityContext } from "./identity-context";

export interface SirenIdentityScopeProps {
  readonly children: ReactNode;
}

export function SirenIdentityScope({
  children,
}: SirenIdentityScopeProps): ReactNode {
  const scope = useId();
  const identities = useMemo(
    () => AccessibilityIdentityFactory.scoped(scope),
    [scope],
  );
  return (
    <SirenIdentityContext.Provider value={identities}>
      {children}
    </SirenIdentityContext.Provider>
  );
}
