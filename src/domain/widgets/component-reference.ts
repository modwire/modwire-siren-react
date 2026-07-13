import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";

export class ComponentReference {
  constructor(readonly key: string) {
    if (key.trim() === "") {
      throw new SirenReactError(
        SirenReactCode.widgetComponent,
        "Widget component key cannot be empty",
      );
    }
    Object.freeze(this);
  }
}
