export class FrameFamily {
  private constructor(readonly value: string) {
    Object.freeze(this);
  }

  static readonly workbench = new FrameFamily("workbench");
  static readonly focus = new FrameFamily("focus");
  static readonly flow = new FrameFamily("flow");
  static readonly pocket = new FrameFamily("pocket");
}
