import type { ReactNode } from "react";

export interface FrameInspector {
  readonly present: boolean;
  content(): ReactNode;
}
