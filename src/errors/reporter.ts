import type { RendererObserver } from "../ports/renderer-observer";
import { SirenReactCode } from "./code";
import { SirenReactError } from "./error";

export class RendererReporter {
  constructor(private readonly observer: RendererObserver) {}

  failure(message: string): void {
    this.report(new SirenReactError(SirenReactCode.rendererFailure, message));
  }

  report(error: SirenReactError): void {
    try {
      this.observer.failed(error);
    } catch {
      return;
    }
  }
}
