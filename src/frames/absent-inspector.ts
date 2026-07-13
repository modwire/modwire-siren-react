import type { ReactNode } from "react";

import type { FrameInspector } from "../ports/inspector";

export class AbsentInspector implements FrameInspector {
  readonly present = false;

  content(): ReactNode {
    return false;
  }
}
