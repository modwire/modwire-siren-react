export class InteractionDirection {
  private constructor(readonly value: string) {
    Object.freeze(this);
  }

  static readonly next = new InteractionDirection("next");
  static readonly previous = new InteractionDirection("previous");
  static readonly first = new InteractionDirection("first");
  static readonly last = new InteractionDirection("last");
}
