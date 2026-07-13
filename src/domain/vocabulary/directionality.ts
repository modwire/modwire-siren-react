export class LayoutDirection {
  private constructor(readonly value: "ltr" | "rtl") {
    Object.freeze(this);
  }

  static readonly leftToRight = new LayoutDirection("ltr");
  static readonly rightToLeft = new LayoutDirection("rtl");
}
