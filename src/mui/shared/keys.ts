export class BrowserKey {
  static readonly arrowDown = "ArrowDown";
  static readonly arrowUp = "ArrowUp";
  static readonly arrowRight = "ArrowRight";
  static readonly arrowLeft = "ArrowLeft";
  static readonly home = "Home";
  static readonly end = "End";
  static readonly escape = "Escape";
  static readonly contextMenu = "ContextMenu";
  static readonly f10 = "F10";

  static navigation(key: string): boolean {
    return [
      BrowserKey.arrowDown,
      BrowserKey.arrowUp,
      BrowserKey.home,
      BrowserKey.end,
      BrowserKey.escape,
    ].includes(key);
  }
}
