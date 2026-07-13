import type { ReactNode } from "react";

import type { SirenReactOptions } from "../../runtime/options";
import { SirenThemeProvider } from "../../theme/provider";

export interface FrameThemeProps {
  readonly options: SirenReactOptions;
  readonly children: ReactNode;
}

export function FrameTheme({ options, children }: FrameThemeProps): ReactNode {
  return (
    <SirenThemeProvider theme={options.theme}>{children}</SirenThemeProvider>
  );
}
