import type { UiDispatcher } from "../adapters/dispatcher";
import { useSirenStore } from "./use-store";

export function useSirenDispatch(): UiDispatcher {
  return useSirenStore().dispatcher;
}
