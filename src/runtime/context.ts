import { createContext } from "react";
import type { SessionContext } from "../ports/context";
import { MissingSessionContext } from "./missing";

export const SirenSessionContext = createContext<SessionContext>(
  new MissingSessionContext(),
);
