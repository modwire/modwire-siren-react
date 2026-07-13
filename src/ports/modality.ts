import type { InputModality } from "../domain/vocabulary/modality";

export interface ModalityPort {
  readonly getSnapshot: () => InputModality;
  readonly getServerSnapshot: () => InputModality;
  readonly subscribe: (listener: () => void) => () => void;
}
