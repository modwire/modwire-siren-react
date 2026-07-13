import { ViewportClass } from "../domain/vocabulary/viewport";
import type { ViewportPort } from "../ports/viewport";
import type { ViewportThresholds } from "./viewport-thresholds";
import { BrowserEvent } from "./browser-event";

export class BrowserViewportAdapter implements ViewportPort {
  private readonly listeners = new Set<() => void>();
  private connected = false;

  constructor(private readonly thresholds: ViewportThresholds) {}

  readonly getSnapshot = (): ViewportClass => {
    if (typeof window === "undefined") return ViewportClass.medium;
    if (window.innerWidth < this.thresholds.compact)
      return ViewportClass.compact;
    if (window.innerWidth < this.thresholds.expanded)
      return ViewportClass.medium;
    return ViewportClass.expanded;
  };

  readonly getServerSnapshot = (): ViewportClass => ViewportClass.medium;

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    this.connect();
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) this.disconnect();
    };
  };

  private readonly changed = (): void => {
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        continue;
      }
    }
  };

  private connect(): void {
    if (this.connected || typeof window === "undefined") return;
    this.connected = true;
    window.addEventListener(BrowserEvent.resize, this.changed);
  }

  private disconnect(): void {
    if (!this.connected || typeof window === "undefined") return;
    window.removeEventListener(BrowserEvent.resize, this.changed);
    this.connected = false;
  }
}
