import { AbsentInspector } from "./absent-inspector";
import { FlowFrameConfiguration } from "./flow-configuration";
import { FocusFrameConfiguration } from "./focus-configuration";
import { FrameConfigurations } from "./configuration";
import { PocketFrameConfiguration } from "./pocket-configuration";
import { WorkbenchFrameConfiguration } from "./workbench-configuration";

export class StandardFrameConfigurations {
  create(): FrameConfigurations {
    return new FrameConfigurations(
      new FocusFrameConfiguration(false),
      new WorkbenchFrameConfiguration(new AbsentInspector()),
      new FlowFrameConfiguration(true),
      new PocketFrameConfiguration(5),
    );
  }
}
