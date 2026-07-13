import { InputModality } from "../domain/vocabulary/modality";
import type { ModalityPort } from "../ports/modality";

export class BrowserModalityAdapter implements ModalityPort {
  private readonly listeners = new Set<() => void>();
  private current = InputModality.keyboard;
  private connected = false;

  readonly getSnapshot = (): InputModality => this.current;
  readonly getServerSnapshot = (): InputModality => InputModality.keyboard;

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    this.connect();
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) this.disconnect();
    };
  };

  private readonly keyboard = (): void => {
    this.change(InputModality.keyboard);
  };

  private readonly pointer = (): void => {
    this.change(InputModality.pointer);
  };

  private readonly touch = (): void => {
    this.change(InputModality.touch);
  };

  private change(modality: InputModality): void {
    if (this.current === modality) return;
    this.current = modality;
    for (const listener of [...this.listeners]) listener();
  }

  private connect(): void {
    if (this.connected || typeof window === "undefined") return;
    this.connected = true;
    window.addEventListener("keydown", this.keyboard, true);
    window.addEventListener("pointerdown", this.pointer, true);
    window.addEventListener("touchstart", this.touch, true);
  }

  private disconnect(): void {
    if (!this.connected || typeof window === "undefined") return;
    window.removeEventListener("keydown", this.keyboard, true);
    window.removeEventListener("pointerdown", this.pointer, true);
    window.removeEventListener("touchstart", this.touch, true);
    this.connected = false;
  }
}
