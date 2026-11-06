import { GlassBackground } from "@/components/glass-background";
import { LiquidGlassView } from "@/components/liquid-glass";
import { ThemedText } from "@/components/themed-text";
import { GlassPalette } from "@/constants/theme";
import { UI_TEXT } from "@/constants/ui-text";
import { useGamePersistence } from "@/hooks/use-game-persistence";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function IntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loadGameState } = useGamePersistence();
  const [checkedSavedGame, setCheckedSavedGame] = useState(false);

  useEffect(() => {
    const checkSavedGame = async () => {
      const savedState = await loadGameState();
      if (savedState && savedState.screen !== "names") {
        router.replace("/");
        return;
      }
      setCheckedSavedGame(true);
    };
    checkSavedGame();
  }, [loadGameState, router]);

  const handleLetsPlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.push("/");
  };

  if (!checkedSavedGame) {
    return <GlassBackground><View style={{ flex: 1 }} /></GlassBackground>;
  }

  return (
    <GlassBackground>
      <View style={[styles.logoArea, { paddingTop: Math.max(20, insets.top) }]}>
        <LiquidGlassView
          borderRadius={48}
          tintColor="rgba(168, 230, 76, 0.14)"
          borderColor={GlassPalette.specularEmeraldRim}
          style={styles.logoFrame}
        >
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel={UI_TEXT.APP_TITLE}
          />
        </LiquidGlassView>
        <ThemedText style={styles.title}>{UI_TEXT.APP_TITLE}</ThemedText>
        <ThemedText style={styles.tagline}>
          Roll a fresh shot modifier on every throw.
        </ThemedText>
      </View>

      <View
        style={[
          styles.bottomArea,
          { paddingBottom: Math.max(40, insets.bottom + 32) },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleLetsPlay}
          style={styles.playButtonTouch}
        >
          <LiquidGlassView
            interactive
            borderRadius={26}
            tintColor={GlassPalette.glassLimeCTA}
            borderColor={GlassPalette.specularEmeraldRim}
            style={styles.playButton}
          >
            <ThemedText style={styles.playButtonText}>
              {UI_TEXT.INTRO_LETS_PLAY}
            </ThemedText>
          </LiquidGlassView>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.credit}
          onPress={() => Linking.openURL(UI_TEXT.CREDIT_INSTAGRAM_URL)}
          accessibilityRole="link"
          accessibilityLabel={`${UI_TEXT.CREDIT_TEXT} on Instagram`}
        >
          <ThemedText style={styles.creditText}>
            {UI_TEXT.CREDIT_TEXT}
          </ThemedText>
          <ThemedText style={styles.creditLink}>@aldrin_discgolf</ThemedText>
        </TouchableOpacity>
      </View>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  logoArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logoFrame: {
    padding: 18,
    marginBottom: 20,
  },
  logo: {
    width: 210,
    height: 210,
    borderRadius: 32,
  },
  title: {
    fontSize: 36,
    fontFamily: "Fredoka_600SemiBold",
    color: GlassPalette.textPrimary,
    lineHeight: 42,
    textAlign: "center",
  },
  tagline: {
    marginTop: 8,
    fontSize: 16,
    color: GlassPalette.textSecondary,
    textAlign: "center",
  },
  bottomArea: {
    paddingHorizontal: 32,
    alignItems: "center",
    gap: 18,
  },
  playButtonTouch: {
    alignSelf: "stretch",
  },
  playButton: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  playButtonText: {
    fontSize: 28,
    fontWeight: "800",
    color: GlassPalette.textPrimary,
    lineHeight: 34,
  },
  credit: {
    alignItems: "center",
    gap: 2,
  },
  creditText: {
    fontSize: 13,
    color: GlassPalette.textMuted,
  },
  creditLink: {
    fontSize: 13,
    color: GlassPalette.textAccentGold,
    fontWeight: "700",
  },
});
