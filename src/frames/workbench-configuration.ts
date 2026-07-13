import type { FrameInspector } from "../ports/inspector";

export class WorkbenchFrameConfiguration {
  constructor(readonly inspector: FrameInspector) {
    Object.freeze(this);
  }
}
