export class InteractionDensity {
  private constructor(readonly value: string) {
    Object.freeze(this);
  }

  static readonly compact = new InteractionDensity("compact");
  static readonly standard = new InteractionDensity("standard");
  static readonly touch = new InteractionDensity("touch");
}
