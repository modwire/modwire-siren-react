import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import type { InteractionTree } from "../../domain/interactions/tree";
import { useSirenDispatch } from "../../runtime/use-dispatch";
import { MuiInteractionBinding } from "./binding";
import { DomFocusAdapter } from "./focus";
import { MuiInteractionView } from "./view";
import type { DomIdentityPolicy } from "../../ports/dom-identity";
import { useSirenIdentities } from "../../runtime/use-identities";

export function useInteractionBinding(
  tree: InteractionTree,
  locale: string,
  identities: DomIdentityPolicy,
): MuiInteractionView {
  const dispatcher = useSirenDispatch();
  const identityScope = useSirenIdentities();
  const focusIdentities = useMemo(
    () => identities.scope(identityScope),
    [identities, identityScope],
  );
  const [binding] = useState(
    () =>
      new MuiInteractionBinding(
        dispatcher,
        tree,
        locale,
        identityScope,
        focusIdentities,
      ),
  );
  useEffect(() => binding.mount(), [binding]);
  useEffect(() => {
    binding.replace(tree);
  }, [binding, tree]);
  const snapshot = useSyncExternalStore(
    binding.subscribe,
    binding.getSnapshot,
    binding.getServerSnapshot,
  );
  useEffect(() => {
    new DomFocusAdapter().apply(snapshot.focus, focusIdentities);
  }, [focusIdentities, snapshot.focus]);
  return new MuiInteractionView(binding, snapshot);
}
