import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

import type { FrameView } from "../../frames/view";

export interface FrameHeaderProps {
  readonly view: FrameView;
  readonly position: "static" | "sticky";
  readonly children: ReactNode;
}

export function FrameHeader({
  view,
  position,
  children,
}: FrameHeaderProps): React.JSX.Element {
  return (
    <AppBar component="header" position={position}>
      <Toolbar variant="dense">
        <Typography component="p" variant="subtitle1">
          {view.presentation.document.name.value}
        </Typography>
        {children}
      </Toolbar>
    </AppBar>
  );
}
