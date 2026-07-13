import { InputModality } from "../domain/vocabulary/modality";
import type { ModalityPort } from "../ports/modality";
import { BrowserEvent } from "./browser-event";

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
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        continue;
      }
    }
  }

  private connect(): void {
    if (this.connected || typeof window === "undefined") return;
    this.connected = true;
    window.addEventListener(BrowserEvent.keyboard, this.keyboard, true);
    window.addEventListener(BrowserEvent.pointer, this.pointer, true);
    window.addEventListener(BrowserEvent.touch, this.touch, true);
  }

  private disconnect(): void {
    if (!this.connected || typeof window === "undefined") return;
    window.removeEventListener(BrowserEvent.keyboard, this.keyboard, true);
    window.removeEventListener(BrowserEvent.pointer, this.pointer, true);
    window.removeEventListener(BrowserEvent.touch, this.touch, true);
    this.connected = false;
  }
}
