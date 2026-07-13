import type { RendererObserver } from "../ports/renderer-observer";

export class SilentRendererObserver implements RendererObserver {
  failed(): void {
    Object.freeze(this);
  }
}
