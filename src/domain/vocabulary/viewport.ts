export class ViewportClass {
  private constructor(readonly value: string) {
    Object.freeze(this);
  }

  static readonly compact = new ViewportClass("compact");
  static readonly medium = new ViewportClass("medium");
  static readonly expanded = new ViewportClass("expanded");
}
