import type { ViewportClass } from "../domain/vocabulary/viewport";

export interface ViewportPort {
  readonly getSnapshot: () => ViewportClass;
  readonly getServerSnapshot: () => ViewportClass;
  readonly subscribe: (listener: () => void) => () => void;
}
