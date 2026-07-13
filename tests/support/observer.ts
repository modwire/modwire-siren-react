import type { RendererObserver } from "@modwire/siren-react/extensions";

export class RecordingRendererObserver implements RendererObserver {
  readonly failures: unknown[] = [];

  failed(error: unknown): void {
    this.failures.push(error);
  }
}
