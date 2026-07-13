import type { ReactElement } from "react";

import type { InteractionIcon } from "../domain/interactions/icon";
import type { IconReference } from "../domain/interactions/icon-reference";

export interface IconRegistry {
  resolve(icon: InteractionIcon, fallback: IconReference): ReactElement;
}
