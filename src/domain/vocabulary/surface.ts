export class InteractionSurface {
  private constructor(readonly value: string) {
    Object.freeze(this);
  }

  static readonly menu = new InteractionSurface("menu");
  static readonly bar = new InteractionSurface("bar");
  static readonly rail = new InteractionSurface("rail");
  static readonly palette = new InteractionSurface("palette");
  static readonly sheet = new InteractionSurface("sheet");
  static readonly dial = new InteractionSurface("dial");
  static readonly contextMenu = new InteractionSurface("context-menu");
}
