import { createTheme, type Theme } from "@mui/material/styles";

import type { SirenTheme } from "./theme";

export class MuiThemeFactory {
  create(tokens: SirenTheme): Theme {
    return createTheme({
      direction: tokens.direction.value,
      shape: { borderRadius: 6 },
      spacing: 4,
      transitions: {
        duration: {
          shortest: tokens.motion.fast,
          shorter: tokens.motion.fast,
          short: tokens.motion.standard,
        },
        easing: { easeInOut: tokens.motion.easing },
      },
      palette: {
        primary: { main: tokens.colors.operation },
        success: { main: tokens.colors.success },
        warning: { main: tokens.colors.warning },
        error: { main: tokens.colors.failure },
      },
      components: {
        MuiIconButton: {
          defaultProps: { size: "small" },
          styleOverrides: {
            root: {
              minWidth: tokens.metrics.compactControl,
              minHeight: tokens.metrics.compactControl,
              "&.Mui-focusVisible": {
                outline: `${String(tokens.metrics.focusRing)}px solid ${tokens.colors.focus}`,
                outlineOffset: 2,
              },
              "@media (pointer: coarse)": {
                minWidth: tokens.metrics.touchTarget,
                minHeight: tokens.metrics.touchTarget,
              },
            },
          },
        },
        MuiMenuItem: {
          defaultProps: { dense: true },
          styleOverrides: {
            root: {
              minHeight: tokens.metrics.compactControl,
              "&.Mui-focusVisible": {
                outline: `${String(tokens.metrics.focusRing)}px solid ${tokens.colors.focus}`,
                outlineOffset: -2,
              },
              "@media (pointer: coarse)": {
                minHeight: tokens.metrics.touchTarget,
              },
            },
          },
        },
        MuiTooltip: { defaultProps: { arrow: true, enterDelay: 500 } },
        MuiButtonBase: {
          styleOverrides: {
            root: {
              "@media (prefers-reduced-motion: reduce)": {
                animationDuration: "0.01ms !important",
                transitionDuration: "0.01ms !important",
              },
              "@media (forced-colors: active)": {
                "&.Mui-focusVisible": {
                  outlineColor: "CanvasText",
                },
              },
            },
          },
        },
      },
    });
  }
}
