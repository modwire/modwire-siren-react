import type { ReactNode } from "react";

import type { InteractionIdentity } from "../domain/interactions/identity";
import type { CommandSurfaceProps } from "./surface-props";

export interface ContextMenuProps extends CommandSurfaceProps {
  readonly target: InteractionIdentity;
  readonly children: ReactNode;
}
