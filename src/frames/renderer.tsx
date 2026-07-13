import type { ReactNode } from "react";

import { FrameFamily } from "../domain/vocabulary/frame";
import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";
import { FlowFrame } from "../mui/frames/flow";
import { FocusFrame } from "../mui/frames/focus";
import { PocketFrame } from "../mui/frames/pocket";
import { WorkbenchFrame } from "../mui/frames/workbench";
import type { SirenReactOptions } from "../runtime/options";

export interface FrameRendererProps {
  readonly family: FrameFamily;
  readonly options: SirenReactOptions;
}

export function FrameRenderer({
  family,
  options,
}: FrameRendererProps): ReactNode {
  if (family === FrameFamily.focus) return <FocusFrame options={options} />;
  if (family === FrameFamily.workbench) {
    return <WorkbenchFrame options={options} />;
  }
  if (family === FrameFamily.flow) return <FlowFrame options={options} />;
  if (family === FrameFamily.pocket) return <PocketFrame options={options} />;
  throw new SirenReactError(
    SirenReactCode.optionsInvalid,
    "Frame family is not supported",
  );
}
