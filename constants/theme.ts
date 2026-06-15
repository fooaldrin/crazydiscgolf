/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

/**
 * Crazy Disc Golf brand palette (derived from the app icon).
 * Split-complementary around green: green + orange + violet.
 */
export const Palette = {
  green: "#6BC235", // primary brand
  greenDark: "#4E9E1F", // selected borders / pressed
  greenDeep: "#186A22", // strong outlines / deep accents
  lime: "#A8E64C", // light accent fill / selected
  limeSoft: "#D9F2B8", // light tint background
  greenTint: "#EEF7DD", // softest card background
  orange: "#F47F1D", // accent
  orangeDeep: "#DC6E10", // white-text CTA buttons (accessible)
  yellow: "#FCAE24", // badges / special buttons
  yellowDeep: "#E89A12", // badge borders
  violet: "#8A3FD9", // tertiary accent / active highlights
  canvas: "#F8F7F2", // off-white background
  text: "#333333", // body text
  textMuted: "#666666",
  white: "#FFFFFF",
};

const tintColorLight = Palette.green;
const tintColorDark = Palette.green;

export const Colors = {
  light: {
    text: Palette.text,
    background: Palette.white,
    tint: tintColorLight,
    icon: Palette.green,
    tabIconDefault: Palette.green,
    tabIconSelected: Palette.lime,
  },
  dark: {
    text: Palette.text,
    background: Palette.white,
    tint: tintColorDark,
    icon: Palette.green,
    tabIconDefault: Palette.green,
    tabIconSelected: Palette.lime,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
