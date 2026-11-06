import { BlurView } from "expo-blur";
import {
  GlassContainer,
  GlassView,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

const HAS_NATIVE_LIQUID_GLASS =
  Platform.OS === "ios" &&
  typeof isLiquidGlassAvailable === "function" &&
  isLiquidGlassAvailable();

interface LiquidGlassViewProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  effect?: "regular" | "clear";
  tintColor?: string;
  borderColor?: string;
  borderRadius?: number;
  intensity?: number;
  interactive?: boolean;
}

/**
 * Apple iOS 26/27 Liquid Glass Surface.
 * Uses native `expo-glass-effect` (`GlassView`) when available on iOS 26+
 * and layers optical blur + specular rim luminance for rich depth across all runtimes.
 */
export function LiquidGlassView({
  children,
  style,
  effect = "regular",
  tintColor = "rgba(255, 255, 255, 0.08)",
  borderColor = "rgba(255, 255, 255, 0.28)",
  borderRadius = 22,
  intensity = 42,
  interactive = false,
}: LiquidGlassViewProps) {
  if (HAS_NATIVE_LIQUID_GLASS) {
    return (
      <GlassView
        glassEffectStyle={effect}
        tintColor={tintColor}
        isInteractive={interactive}
        colorScheme="dark"
        style={[
          styles.base,
          {
            borderRadius,
            borderColor,
          },
          style,
        ]}
      >
        <LinearGradient
          pointerEvents="none"
          colors={[
            "rgba(255, 255, 255, 0.20)",
            "rgba(255, 255, 255, 0.03)",
            "rgba(255, 255, 255, 0.0)",
          ]}
          locations={[0, 0.45, 1]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        />
        {children}
      </GlassView>
    );
  }

  return (
    <View
      style={[
        styles.base,
        {
          borderRadius,
          borderColor,
          backgroundColor: tintColor,
        },
        style,
      ]}
    >
      <BlurView
        intensity={effect === "clear" ? Math.round(intensity * 0.65) : intensity}
        tint="dark"
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />
      <LinearGradient
        pointerEvents="none"
        colors={[
          "rgba(255, 255, 255, 0.22)",
          "rgba(255, 255, 255, 0.04)",
          "rgba(0, 0, 0, 0.08)",
        ]}
        locations={[0, 0.5, 1]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />
      {children}
    </View>
  );
}

interface LiquidGlassGroupProps {
  children: ReactNode;
  spacing?: number;
  style?: StyleProp<ViewStyle>;
}

export function LiquidGlassGroup({
  children,
  spacing = 12,
  style,
}: LiquidGlassGroupProps) {
  if (HAS_NATIVE_LIQUID_GLASS) {
    return (
      <GlassContainer spacing={spacing} style={style}>
        {children}
      </GlassContainer>
    );
  }
  return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
    borderWidth: 1.2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
  },
});
