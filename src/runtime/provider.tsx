import { useEffect, useMemo, type ReactNode } from "react";
import type { SessionInput } from "../adapters/session";
import { UiSessionStore } from "../adapters/store";
import { BoundSessionContext } from "./bound";
import { SirenSessionContext } from "./context";

export interface SirenSessionProviderProps {
  readonly session: SessionInput;
  readonly children: ReactNode;
}

export function SirenSessionProvider({
  session,
  children,
}: SirenSessionProviderProps): ReactNode {
  const store = useMemo(() => new UiSessionStore(session), [session]);
  const context = useMemo(() => new BoundSessionContext(store), [store]);
  useEffect(
    () => () => {
      store.dispose();
    },
    [store],
  );
  return (
    <SirenSessionContext.Provider value={context}>
      {children}
    </SirenSessionContext.Provider>
  );
}
