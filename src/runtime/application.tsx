import type { ReactNode } from "react";

import type { SessionInput } from "../adapters/session";
import type { FrameFamily } from "../domain/vocabulary/frame";
import { FrameRenderer } from "../frames/renderer";
import type { SirenReactOptions } from "./options";
import { SirenSessionProvider } from "./provider";

export interface SirenApplicationProps {
  readonly session: SessionInput;
  readonly options: SirenReactOptions;
  readonly frame: FrameFamily;
}

export function SirenApplication({
  session,
  options,
  frame,
}: SirenApplicationProps): ReactNode {
  return (
    <SirenSessionProvider session={session}>
      <FrameRenderer family={frame} options={options} />
    </SirenSessionProvider>
  );
}
