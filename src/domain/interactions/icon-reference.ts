import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";
import { IconKind } from "../vocabulary/icon-kind";
import { InteractionIcon } from "./icon";

export class IconReference extends InteractionIcon {
  readonly key: string;

  constructor(key: string) {
    super(IconKind.reference);
    this.key = key.trim();
    if (this.key === "") {
      throw new SirenReactError(
        SirenReactCode.interactionIcon,
        "Interaction icon key cannot be empty",
      );
    }
    Object.freeze(this);
  }
}
