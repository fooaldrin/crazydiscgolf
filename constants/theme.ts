import { Platform } from "react-native";

/**
 * Crazy Disc Golf — Apple Liquid Glass ("Emerald Canopy") Optical Palette
 */
export const GlassPalette = {
  // Deep Course Backdrop Gradient (Top -> Mid -> Bottom)
  canopyDeep: "#061710",
  fairwayEmerald: "#0D3520",
  mossDark: "#124228",
  canopyFloor: "#081E13",

  // Ambient Light Orbs (for glass refraction)
  orbLime: "rgba(168, 230, 76, 0.34)",
  orbGold: "rgba(252, 174, 36, 0.24)",
  orbViolet: "rgba(138, 63, 217, 0.22)",
  orbCyan: "rgba(43, 140, 190, 0.22)",

  // Glass Tints
  glassNeutral: "rgba(255, 255, 255, 0.10)",
  glassElevated: "rgba(255, 255, 255, 0.15)",
  glassEmerald: "rgba(107, 194, 53, 0.24)",
  glassLimeCTA: "rgba(168, 230, 76, 0.36)",
  glassGoldCTA: "rgba(252, 174, 36, 0.36)",
  glassOrangeAccent: "rgba(244, 127, 29, 0.34)",
  glassVioletActive: "rgba(138, 63, 217, 0.34)",
  glassDanger: "rgba(239, 68, 68, 0.36)",
  glassRecessed: "rgba(4, 16, 10, 0.48)",

  // Specular Borders & Rims
  specularBorderBright: "rgba(255, 255, 255, 0.36)",
  specularBorderSoft: "rgba(255, 255, 255, 0.18)",
  specularEmeraldRim: "rgba(168, 230, 76, 0.62)",
  specularGoldRim: "rgba(252, 174, 36, 0.68)",

  // High-Contrast Typography on Glass
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(240, 253, 244, 0.80)",
  textMuted: "rgba(240, 253, 244, 0.54)",
  textAccentLime: "#C6F66F",
  textAccentGold: "#FFD166",
};

export const Palette = {
  green: "#6BC235",
  greenDark: "#4E9E1F",
  greenDeep: "#186A22",
  lime: "#A8E64C",
  limeSoft: "#D9F2B8",
  greenTint: "#EEF7DD",
  orange: "#F47F1D",
  orangeDeep: "#DC6E10",
  yellow: "#FCAE24",
  yellowDeep: "#E89A12",
  violet: "#8A3FD9",
  canvas: "#061710",
  text: "#FFFFFF",
  textMuted: "rgba(240, 253, 244, 0.65)",
  white: "#FFFFFF",
};

const tintColorLight = Palette.lime;
const tintColorDark = Palette.lime;

export const Colors = {
  light: {
    text: GlassPalette.textPrimary,
    background: "transparent",
    tint: tintColorLight,
    icon: Palette.lime,
    tabIconDefault: Palette.green,
    tabIconSelected: Palette.lime,
  },
  dark: {
    text: GlassPalette.textPrimary,
    background: "transparent",
    tint: tintColorDark,
    icon: Palette.lime,
    tabIconDefault: Palette.green,
    tabIconSelected: Palette.lime,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
