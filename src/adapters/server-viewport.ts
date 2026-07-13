import { ViewportClass } from "../domain/vocabulary/viewport";
import type { ViewportPort } from "../ports/viewport";

export class ServerViewportAdapter implements ViewportPort {
  readonly getSnapshot = (): ViewportClass => ViewportClass.medium;
  readonly getServerSnapshot = (): ViewportClass => ViewportClass.medium;
  readonly subscribe = (): (() => void) => () => {
    Object.freeze(this);
  };
}
