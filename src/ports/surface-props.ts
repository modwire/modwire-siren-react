import type { InteractionTree } from "../domain/interactions/tree";
import type { IconRegistry } from "./icon-registry";
import type { SirenTheme } from "../theme/theme";

export interface CommandSurfaceProps {
  readonly tree: InteractionTree;
  readonly label: string;
  readonly locale: string;
  readonly icons: IconRegistry;
  readonly theme: SirenTheme;
}
