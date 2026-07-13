import { IconKind } from "../vocabulary/icon-kind";
import { InteractionIcon } from "./icon";

export class AbsentIcon extends InteractionIcon {
  constructor() {
    super(IconKind.absent);
    Object.freeze(this);
  }
}
