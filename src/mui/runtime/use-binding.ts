import { useEffect, useState, useSyncExternalStore } from "react";

import type { InteractionTree } from "../../domain/interactions/tree";
import { useSirenDispatch } from "../../runtime/use-dispatch";
import { MuiInteractionBinding } from "./binding";
import { DomFocusAdapter } from "./focus";
import { MuiInteractionView } from "./view";

export function useInteractionBinding(
  tree: InteractionTree,
  locale: string,
): MuiInteractionView {
  const dispatcher = useSirenDispatch();
  const [binding] = useState(
    () => new MuiInteractionBinding(dispatcher, tree, locale),
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
    new DomFocusAdapter().apply(snapshot.focus);
  }, [snapshot.focus]);
  return new MuiInteractionView(binding, snapshot);
}
