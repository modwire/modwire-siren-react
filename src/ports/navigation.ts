import type { InteractionIdentity } from "../domain/interactions/identity";

export interface NavigationPort {
  navigate(target: InteractionIdentity): void;
}
