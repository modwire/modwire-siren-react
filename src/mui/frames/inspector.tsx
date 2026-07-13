import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";

import { AbsentIcon } from "../../domain/interactions/absent-icon";
import { IconReference } from "../../domain/interactions/icon-reference";
import { LayoutDirection } from "../../domain/vocabulary/directionality";
import { StandardIconName } from "../../domain/vocabulary/icon-name";
import { ViewportClass } from "../../domain/vocabulary/viewport";
import type { FrameView } from "../../frames/view";

export interface FrameInspectorProps {
  readonly view: FrameView;
}

export function FrameInspector({
  view,
}: FrameInspectorProps): React.JSX.Element {
  const inspector = view.options.frames.workbench.inspector;
  const [open, setOpen] = useState(false);
  if (!inspector.present) return <span aria-hidden hidden />;
  if (view.viewport !== ViewportClass.expanded) {
    return (
      <>
        <Tooltip title={view.options.accessibility.inspector}>
          <IconButton
            aria-label={view.options.accessibility.inspector}
            onClick={() => {
              setOpen(true);
            }}
          >
            {view.options.icons.resolve(
              new AbsentIcon(),
              new IconReference(StandardIconName.group),
            )}
          </IconButton>
        </Tooltip>
        <Drawer
          anchor={
            view.options.theme.direction === LayoutDirection.rightToLeft
              ? "left"
              : "right"
          }
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <Box
            aria-label={view.options.accessibility.inspector}
            component="aside"
          >
            {inspector.content()}
          </Box>
        </Drawer>
      </>
    );
  }
  return (
    <Box aria-label={view.options.accessibility.inspector} component="aside">
      {inspector.content()}
    </Box>
  );
}
