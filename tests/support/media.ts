export class MediaQueryController {
  private readonly active = new Set<string>();

  install(): void {
    window.matchMedia = (query: string): MediaQueryList =>
      ({
        addEventListener: () => undefined,
        addListener: () => undefined,
        dispatchEvent: () => true,
        matches: this.active.has(query),
        media: query,
        onchange: null,
        removeEventListener: () => undefined,
        removeListener: () => undefined,
      }) satisfies MediaQueryList;
  }
}
