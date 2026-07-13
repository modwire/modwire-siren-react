import type { FlowFrameConfiguration } from "./flow-configuration";
import type { FocusFrameConfiguration } from "./focus-configuration";
import type { PocketFrameConfiguration } from "./pocket-configuration";
import type { WorkbenchFrameConfiguration } from "./workbench-configuration";

export class FrameConfigurations {
  constructor(
    readonly focus: FocusFrameConfiguration,
    readonly workbench: WorkbenchFrameConfiguration,
    readonly flow: FlowFrameConfiguration,
    readonly pocket: PocketFrameConfiguration,
  ) {
    Object.freeze(this);
  }
}
