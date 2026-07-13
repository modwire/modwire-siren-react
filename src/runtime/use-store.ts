import { useContext } from "react";
import type { UiSessionStore } from "../adapters/store";
import { SirenSessionContext } from "./context";

export function useSirenStore(): UiSessionStore {
  return useContext(SirenSessionContext).requireStore();
}
