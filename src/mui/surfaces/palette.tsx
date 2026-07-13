import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { useMemo, type ChangeEvent, type ReactNode } from "react";

import { DismissInteraction } from "../../domain/events/dismiss";
import { OpenInteraction } from "../../domain/events/open";
import { SearchInteractions } from "../../domain/events/search";
import { AbsentIcon } from "../../domain/interactions/absent-icon";
import { IconReference } from "../../domain/interactions/icon-reference";
import { SearchingInteractionState } from "../../domain/state/searching";
import { StandardIconName } from "../../domain/vocabulary/icon-name";
import { InputModality } from "../../domain/vocabulary/modality";
import { SurfaceIdentityRole } from "../../domain/vocabulary/surface-role";
import type { CommandSurfaceProps } from "../../ports/surface-props";
import { SirenThemeProvider } from "../../theme/provider";
import { useInteractionBinding } from "../runtime/use-binding";
import { BrowserKey } from "../shared/keys";
import { MuiKeyboardAdapter } from "../shared/keyboard";
import { MuiInteractionReader } from "../shared/reader";
import { CommandPaletteItem } from "./palette-item";
import { PaletteResults } from "./palette-results";
import { ChildDomIdentityPolicy } from "../runtime/child-identity";

export function CommandPalette({
  tree,
  label,
  locale,
  icons,
  theme,
}: CommandSurfaceProps): ReactNode {
  const view = useInteractionBinding(
    tree,
    locale,
    ChildDomIdentityPolicy.palette,
  );
  const reader = useMemo(() => new MuiInteractionReader(tree), [tree]);
  const origin = tree.root.identity.child(SurfaceIdentityRole.paletteTrigger);
  const state = view.snapshot.state;
  const query = state instanceof SearchingInteractionState ? state.query : "";
  const results = new PaletteResults().select(view.snapshot, reader);
  const keyboard = new MuiKeyboardAdapter(
    view.binding,
    reader,
    tree.root.identity,
    theme.direction,
  );
  const changed = (event: ChangeEvent<HTMLInputElement>): void => {
    view.binding.send(new SearchInteractions(""));
    if (event.target.value !== "") {
      view.binding.send(new SearchInteractions(event.target.value));
    }
  };
  return (
    <SirenThemeProvider theme={theme}>
      <Tooltip title={label}>
        <IconButton
          id={view.binding.identities.interaction(origin)}
          aria-label={label}
          aria-haspopup="dialog"
          aria-expanded={reader.isOpen(view.snapshot)}
          onPointerDown={() => {
            view.binding.modality(InputModality.pointer);
          }}
          onTouchStart={() => {
            view.binding.modality(InputModality.touch);
          }}
          onClick={() => {
            view.binding.send(new OpenInteraction(origin, tree.root.identity));
          }}
        >
          {icons.resolve(
            new AbsentIcon(),
            new IconReference(StandardIconName.search),
          )}
        </IconButton>
      </Tooltip>
      <Dialog
        open={reader.isOpen(view.snapshot)}
        onClose={() => {
          view.binding.send(new DismissInteraction());
        }}
        aria-label={label}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            size="small"
            value={query}
            onChange={changed}
            onKeyDown={(event) => {
              if (BrowserKey.navigation(event.key)) keyboard.handle(event);
            }}
            slotProps={{ htmlInput: { "aria-label": label } }}
          />
          <List role="listbox" aria-label={label} dense>
            {results.values.map((node) => (
              <CommandPaletteItem
                key={node.identity.value}
                node={node}
                origin={origin}
                binding={view.binding}
                reader={reader}
                icons={icons}
              />
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </SirenThemeProvider>
  );
}
