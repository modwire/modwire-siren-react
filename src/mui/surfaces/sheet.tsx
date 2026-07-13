import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Tooltip from "@mui/material/Tooltip";
import {
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type UIEvent,
} from "react";

import { DismissInteraction } from "../../domain/events/dismiss";
import { LeaveInteractionGroup } from "../../domain/events/leave-group";
import { OpenInteraction } from "../../domain/events/open";
import { AbsentIcon } from "../../domain/interactions/absent-icon";
import { InteractionDivider } from "../../domain/interactions/divider";
import { IconReference } from "../../domain/interactions/icon-reference";
import { StandardIconName } from "../../domain/vocabulary/icon-name";
import { InputModality } from "../../domain/vocabulary/modality";
import { SurfaceIdentityRole } from "../../domain/vocabulary/surface-role";
import type { CommandSurfaceProps } from "../../ports/surface-props";
import { SirenThemeProvider } from "../../theme/provider";
import { InteractionDomIdentity } from "../runtime/dom-identity";
import { useInteractionBinding } from "../runtime/use-binding";
import { MuiKeyboardAdapter } from "../shared/keyboard";
import { MuiInteractionReader } from "../shared/reader";
import { CommandSheetItem } from "./sheet-item";
import { SheetScrollMemory } from "./scroll-memory";
import { SheetScrollAdapter } from "./scroll";
import { StandardDomIdentityPolicy } from "../runtime/standard-identity";

export function CommandSheet({
  tree,
  label,
  locale,
  icons,
  theme,
}: CommandSurfaceProps): ReactNode {
  const view = useInteractionBinding(
    tree,
    locale,
    StandardDomIdentityPolicy.instance,
  );
  const reader = useMemo(() => new MuiInteractionReader(tree), [tree]);
  const origin = tree.root.identity.child(SurfaceIdentityRole.sheetTrigger);
  const group = reader.currentGroup(view.snapshot);
  const memory = useMemo(() => new SheetScrollMemory(), []);
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    new SheetScrollAdapter().restore(
      list.current,
      memory.recall(group.identity),
    );
  }, [group.identity, memory]);
  const scrolled = (event: UIEvent<HTMLUListElement>): void => {
    memory.remember(group.identity, event.currentTarget.scrollTop);
  };
  const nested = group.identity.value !== tree.root.identity.value;
  const keyboard = new MuiKeyboardAdapter(
    view.binding,
    reader,
    tree.root.identity,
    theme.direction,
  );
  return (
    <SirenThemeProvider theme={theme}>
      <Tooltip title={label}>
        <IconButton
          id={InteractionDomIdentity.from(origin)}
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
            new IconReference(StandardIconName.more),
          )}
        </IconButton>
      </Tooltip>
      <Drawer
        anchor="bottom"
        open={reader.isOpen(view.snapshot)}
        onClose={() => {
          view.binding.send(new DismissInteraction());
        }}
      >
        <List
          ref={list}
          aria-label={label}
          onScroll={scrolled}
          onKeyDown={(event) => {
            keyboard.handle(event);
          }}
          subheader={
            <ListSubheader component="div">
              {nested && (
                <Tooltip title={tree.root.name.value}>
                  <IconButton
                    aria-label={tree.root.name.value}
                    onClick={() => {
                      view.binding.send(
                        new LeaveInteractionGroup(group.identity),
                      );
                    }}
                  >
                    {icons.resolve(
                      new AbsentIcon(),
                      new IconReference(StandardIconName.back),
                    )}
                  </IconButton>
                </Tooltip>
              )}
              {group.name.value}
            </ListSubheader>
          }
        >
          {group.children.values.map((node) =>
            node instanceof InteractionDivider ? (
              <Divider key={node.identity.value} />
            ) : (
              <CommandSheetItem
                key={node.identity.value}
                node={node}
                origin={origin}
                binding={view.binding}
                reader={reader}
                icons={icons}
              />
            ),
          )}
        </List>
      </Drawer>
    </SirenThemeProvider>
  );
}
