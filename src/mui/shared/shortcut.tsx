import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

import { KeyboardShortcut } from "../../domain/interactions/keyboard-shortcut";
import type { InteractionShortcut } from "../../domain/interactions/shortcut";

export interface ShortcutLabelProps {
  readonly shortcut: InteractionShortcut;
}

export function ShortcutLabel({ shortcut }: ShortcutLabelProps): ReactNode {
  if (!(shortcut instanceof KeyboardShortcut)) return <></>;
  return (
    <Typography component="span" variant="caption" color="text.secondary">
      {shortcut.keys.join("+")}
    </Typography>
  );
}
