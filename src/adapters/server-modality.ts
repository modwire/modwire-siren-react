import { InputModality } from "../domain/vocabulary/modality";
import type { ModalityPort } from "../ports/modality";

export class ServerModalityAdapter implements ModalityPort {
  readonly getSnapshot = (): InputModality => InputModality.keyboard;
  readonly getServerSnapshot = (): InputModality => InputModality.keyboard;
  readonly subscribe = (): (() => void) => () => {
    Object.freeze(this);
  };
}
