import { GlassPalette } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface GlassBackgroundProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: "default" | "game" | "celebration";
}

/**
 * Multi-layered atmospheric Emerald Canopy & Sunlit Fairway backdrop.
 * Provides chromatic depth and glowing light orbs behind Liquid Glass surfaces
 * so every card edge refracts warm lime, gold, and forest light.
 */
export function GlassBackground({ children, style }: GlassBackgroundProps) {
  return (
    <View style={[styles.root, style]}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[
          GlassPalette.canopyDeep,
          GlassPalette.fairwayEmerald,
          GlassPalette.mossDark,
          GlassPalette.canopyFloor,
        ]}
        locations={[0, 0.38, 0.74, 1]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Top-Right Sunbeam Lime Light Orb */}
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(168, 230, 76, 0.34)", "rgba(168, 230, 76, 0.0)"]}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.9, y: 0.95 }}
        style={styles.orbTopRight}
      />

      {/* Center-Left Golden Hour Basket Orb (behind Slot Machine chamber) */}
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(252, 174, 36, 0.22)", "rgba(107, 194, 53, 0.0)"]}
        start={{ x: 0.2, y: 0.3 }}
        end={{ x: 0.9, y: 0.9 }}
        style={styles.orbCenterLeft}
      />

      {/* Bottom-Right Twilight Canopy Orb (behind Action Dock) */}
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(107, 194, 53, 0.28)", "rgba(138, 63, 217, 0.0)"]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.1, y: 0.1 }}
        style={styles.orbBottomRight}
      />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GlassPalette.canopyDeep,
  },
  orbTopRight: {
    position: "absolute",
    top: -80,
    right: -70,
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  orbCenterLeft: {
    position: "absolute",
    top: "33%",
    left: -100,
    width: 340,
    height: 340,
    borderRadius: 170,
  },
  orbBottomRight: {
    position: "absolute",
    bottom: -40,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
});
