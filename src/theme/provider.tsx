import { ThemeProvider } from "@mui/material/styles";
import { useMemo, type ReactNode } from "react";

import { MuiThemeFactory } from "./factory";
import type { SirenTheme } from "./theme";

export interface SirenThemeProviderProps {
  readonly theme: SirenTheme;
  readonly children: ReactNode;
}

export function SirenThemeProvider({
  theme,
  children,
}: SirenThemeProviderProps): ReactNode {
  const material = useMemo(() => new MuiThemeFactory().create(theme), [theme]);
  return <ThemeProvider theme={material}>{children}</ThemeProvider>;
}
