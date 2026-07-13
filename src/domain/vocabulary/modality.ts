export class InputModality {
  private constructor(readonly value: string) {
    Object.freeze(this);
  }

  static readonly keyboard = new InputModality("keyboard");
  static readonly pointer = new InputModality("pointer");
  static readonly touch = new InputModality("touch");
}
