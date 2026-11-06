import { GlassBackground } from "@/components/glass-background";
import { GlassScrollView } from "@/components/glass-scroll-view";
import { LiquidGlassGroup, LiquidGlassView } from "@/components/liquid-glass";
import { ThemedText } from "@/components/themed-text";
import { CHALLENGE_PACKS } from "@/constants/random-strings";
import { GlassPalette } from "@/constants/theme";
import { UI_TEXT } from "@/constants/ui-text";
import { useEnabledStrings } from "@/hooks/use-enabled-strings";
import { GameState, useGamePersistence } from "@/hooks/use-game-persistence";
import { Slackey_400Regular, useFonts } from "@expo-google-fonts/slackey";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./index.styles";

const HOLE_PRESETS = [6, 9, 12, 18];

export default function HomeScreen() {
  const [numPlayers, setNumPlayers] = useState(2);
  const [numHoles, setNumHoles] = useState(9);
  const [maxRerolls, setMaxRerolls] = useState(3);
  const [unlimitedRerolls, setUnlimitedRerolls] = useState(false);
  const [savedGame, setSavedGame] = useState<GameState | null>(null);
  const [showGameSetup, setShowGameSetup] = useState(false);

  const router = useRouter();
  const { loadGameState } = useGamePersistence();
  const {
    enabledStrings,
    allStrings,
    activePackId,
    applyPack,
    refreshSettings,
  } = useEnabledStrings();
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    Slackey_400Regular,
  });

  useFocusEffect(
    useCallback(() => {
      refreshSettings();
      const checkSavedGame = async () => {
        const state = await loadGameState();
        if (state && state.screen !== "names") {
          setSavedGame(state);
        } else {
          setSavedGame(null);
        }
      };
      checkSavedGame();
    }, [loadGameState, refreshSettings]),
  );

  if (!fontsLoaded) {
    return null;
  }

  const triggerLightHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const handleContinueSavedGame = () => {
    triggerLightHaptic();
    router.push("/game");
  };

  const handleStartNewGame = () => {
    triggerLightHaptic();
    setShowGameSetup(true);
  };

  const handleStartGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.push({
      pathname: "/game/names",
      params: {
        numPlayers: numPlayers.toString(),
        numHoles: numHoles.toString(),
        maxRerolls: unlimitedRerolls ? "-1" : maxRerolls.toString(),
      },
    });
  };

  const hasSavedGame = !!savedGame;

  if (showGameSetup) {
    return (
      <GlassBackground>
        <View
          style={[
            styles.topBar,
            { paddingTop: Math.max(16, insets.top + 8) },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              triggerLightHaptic();
              setShowGameSetup(false);
            }}
            activeOpacity={0.8}
            accessibilityLabel="Back"
          >
            <LiquidGlassView
              interactive
              borderRadius={21}
              tintColor={GlassPalette.glassElevated}
              borderColor={GlassPalette.specularBorderBright}
              style={styles.navIconButton}
            >
              <ThemedText style={styles.navIconText}>←</ThemedText>
            </LiquidGlassView>
          </TouchableOpacity>

          <ThemedText type="title" style={styles.title}>
            Round Setup
          </ThemedText>

          <TouchableOpacity
            onPress={() => {
              triggerLightHaptic();
              router.push("/settings");
            }}
            activeOpacity={0.8}
            accessibilityLabel="Customize Modifiers"
          >
            <LiquidGlassView
              interactive
              borderRadius={18}
              tintColor={GlassPalette.glassEmerald}
              borderColor={GlassPalette.specularEmeraldRim}
              style={styles.modifiersPillButton}
            >
              <ThemedText style={styles.modifiersPillText}>⚙️ Rules</ThemedText>
            </LiquidGlassView>
          </TouchableOpacity>
        </View>

        <GlassScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {/* Players Selector */}
          <LiquidGlassView
            borderRadius={24}
            tintColor={GlassPalette.glassNeutral}
            borderColor={GlassPalette.specularBorderBright}
            style={styles.selectorContainer}
          >
            <View style={styles.cardHeaderRow}>
              <ThemedText type="subtitle" style={styles.label}>
                👥 {UI_TEXT.SETUP_NUM_PLAYERS}
              </ThemedText>
              <View style={styles.cardSubBadgeWrap}>
                <ThemedText style={styles.cardSubBadge}>
                  {numPlayers === 1 ? "Solo Round" : `${numPlayers}-Player Card`}
                </ThemedText>
              </View>
            </View>
            <LiquidGlassGroup spacing={16} style={styles.pickerRow}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  triggerLightHaptic();
                  setNumPlayers(Math.max(1, numPlayers - 1));
                }}
                disabled={numPlayers <= 1}
              >
                <LiquidGlassView
                  interactive
                  borderRadius={16}
                  tintColor={
                    numPlayers <= 1
                      ? "rgba(255,255,255,0.04)"
                      : GlassPalette.glassOrangeAccent
                  }
                  borderColor={
                    numPlayers <= 1
                      ? GlassPalette.specularBorderSoft
                      : "rgba(253, 186, 116, 0.65)"
                  }
                  style={[
                    styles.pickerButton,
                    numPlayers <= 1 && styles.disabledButton,
                  ]}
                >
                  <ThemedText style={styles.buttonText}>−</ThemedText>
                </LiquidGlassView>
              </TouchableOpacity>

              <View style={styles.valueContainer}>
                <ThemedText style={styles.valueText}>{numPlayers}</ThemedText>
              </View>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  triggerLightHaptic();
                  setNumPlayers(Math.min(10, numPlayers + 1));
                }}
                disabled={numPlayers >= 10}
              >
                <LiquidGlassView
                  interactive
                  borderRadius={16}
                  tintColor={
                    numPlayers >= 10
                      ? "rgba(255,255,255,0.04)"
                      : GlassPalette.glassOrangeAccent
                  }
                  borderColor={
                    numPlayers >= 10
                      ? GlassPalette.specularBorderSoft
                      : "rgba(253, 186, 116, 0.65)"
                  }
                  style={[
                    styles.pickerButton,
                    numPlayers >= 10 && styles.disabledButton,
                  ]}
                >
                  <ThemedText style={styles.buttonText}>+</ThemedText>
                </LiquidGlassView>
              </TouchableOpacity>
            </LiquidGlassGroup>
          </LiquidGlassView>

          {/* Holes Selector with Segmented Glass Pills */}
          <LiquidGlassView
            borderRadius={24}
            tintColor={GlassPalette.glassNeutral}
            borderColor={GlassPalette.specularBorderBright}
            style={styles.selectorContainer}
          >
            <View style={styles.cardHeaderRow}>
              <ThemedText type="subtitle" style={styles.label}>
                ⛳ {UI_TEXT.SETUP_NUM_HOLES}
              </ThemedText>
              <View style={styles.cardSubBadgeWrap}>
                <ThemedText style={styles.cardSubBadge}>
                  {numHoles} {numHoles === 1 ? "Hole" : "Holes"}
                </ThemedText>
              </View>
            </View>

            <LiquidGlassGroup spacing={8} style={styles.presetPillsRow}>
              {HOLE_PRESETS.map((preset) => {
                const isSelected = numHoles === preset;
                return (
                  <TouchableOpacity
                    key={preset}
                    style={{ flex: 1 }}
                    onPress={() => {
                      triggerLightHaptic();
                      setNumHoles(preset);
                    }}
                    activeOpacity={0.8}
                  >
                    <LiquidGlassView
                      interactive
                      effect={isSelected ? "regular" : "clear"}
                      borderRadius={12}
                      tintColor={
                        isSelected
                          ? GlassPalette.glassLimeCTA
                          : "rgba(255, 255, 255, 0.05)"
                      }
                      borderColor={
                        isSelected
                          ? GlassPalette.specularEmeraldRim
                          : GlassPalette.specularBorderSoft
                      }
                      style={styles.presetPill}
                    >
                      <ThemedText
                        style={[
                          styles.presetPillText,
                          isSelected && styles.presetPillTextSelected,
                        ]}
                      >
                        {preset}
                      </ThemedText>
                    </LiquidGlassView>
                  </TouchableOpacity>
                );
              })}
            </LiquidGlassGroup>

            <LiquidGlassGroup spacing={16} style={styles.pickerRow}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  triggerLightHaptic();
                  setNumHoles(Math.max(1, numHoles - 1));
                }}
                disabled={numHoles <= 1}
              >
                <LiquidGlassView
                  interactive
                  borderRadius={16}
                  tintColor={
                    numHoles <= 1
                      ? "rgba(255,255,255,0.04)"
                      : GlassPalette.glassOrangeAccent
                  }
                  borderColor={
                    numHoles <= 1
                      ? GlassPalette.specularBorderSoft
                      : "rgba(253, 186, 116, 0.65)"
                  }
                  style={[
                    styles.pickerButton,
                    numHoles <= 1 && styles.disabledButton,
                  ]}
                >
                  <ThemedText style={styles.buttonText}>−</ThemedText>
                </LiquidGlassView>
              </TouchableOpacity>

              <View style={styles.valueContainer}>
                <ThemedText style={styles.valueText}>{numHoles}</ThemedText>
              </View>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  triggerLightHaptic();
                  setNumHoles(Math.min(36, numHoles + 1));
                }}
                disabled={numHoles >= 36}
              >
                <LiquidGlassView
                  interactive
                  borderRadius={16}
                  tintColor={
                    numHoles >= 36
                      ? "rgba(255,255,255,0.04)"
                      : GlassPalette.glassOrangeAccent
                  }
                  borderColor={
                    numHoles >= 36
                      ? GlassPalette.specularBorderSoft
                      : "rgba(253, 186, 116, 0.65)"
                  }
                  style={[
                    styles.pickerButton,
                    numHoles >= 36 && styles.disabledButton,
                  ]}
                >
                  <ThemedText style={styles.buttonText}>+</ThemedText>
                </LiquidGlassView>
              </TouchableOpacity>
            </LiquidGlassGroup>
          </LiquidGlassView>

          {/* Rerolls Selector */}
          <LiquidGlassView
            borderRadius={24}
            tintColor={GlassPalette.glassNeutral}
            borderColor={GlassPalette.specularBorderBright}
            style={styles.selectorContainer}
          >
            <View style={styles.cardHeaderRow}>
              <ThemedText type="subtitle" style={styles.label}>
                🎲 {UI_TEXT.SETUP_REROLLS}
              </ThemedText>
              <View style={styles.cardSubBadgeWrap}>
                <ThemedText style={styles.cardSubBadge}>
                  {unlimitedRerolls ? "Unlimited" : `${maxRerolls} per round`}
                </ThemedText>
              </View>
            </View>

            <LiquidGlassGroup spacing={16} style={styles.pickerRow}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  triggerLightHaptic();
                  setMaxRerolls(Math.max(0, maxRerolls - 1));
                }}
                disabled={maxRerolls <= 0 || unlimitedRerolls}
              >
                <LiquidGlassView
                  interactive
                  borderRadius={16}
                  tintColor={
                    maxRerolls <= 0 || unlimitedRerolls
                      ? "rgba(255,255,255,0.04)"
                      : GlassPalette.glassOrangeAccent
                  }
                  borderColor={
                    maxRerolls <= 0 || unlimitedRerolls
                      ? GlassPalette.specularBorderSoft
                      : "rgba(253, 186, 116, 0.65)"
                  }
                  style={[
                    styles.pickerButton,
                    (maxRerolls <= 0 || unlimitedRerolls) &&
                      styles.disabledButton,
                  ]}
                >
                  <ThemedText style={styles.buttonText}>−</ThemedText>
                </LiquidGlassView>
              </TouchableOpacity>

              <View
                style={[
                  styles.valueContainer,
                  unlimitedRerolls && styles.disabledValueContainer,
                ]}
              >
                <ThemedText
                  style={[
                    styles.valueText,
                    unlimitedRerolls && styles.disabledText,
                  ]}
                >
                  {unlimitedRerolls ? "∞" : maxRerolls}
                </ThemedText>
              </View>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  triggerLightHaptic();
                  setMaxRerolls(Math.min(99, maxRerolls + 1));
                }}
                disabled={maxRerolls >= 99 || unlimitedRerolls}
              >
                <LiquidGlassView
                  interactive
                  borderRadius={16}
                  tintColor={
                    maxRerolls >= 99 || unlimitedRerolls
                      ? "rgba(255,255,255,0.04)"
                      : GlassPalette.glassOrangeAccent
                  }
                  borderColor={
                    maxRerolls >= 99 || unlimitedRerolls
                      ? GlassPalette.specularBorderSoft
                      : "rgba(253, 186, 116, 0.65)"
                  }
                  style={[
                    styles.pickerButton,
                    (maxRerolls >= 99 || unlimitedRerolls) &&
                      styles.disabledButton,
                  ]}
                >
                  <ThemedText style={styles.buttonText}>+</ThemedText>
                </LiquidGlassView>
              </TouchableOpacity>
            </LiquidGlassGroup>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => {
                triggerLightHaptic();
                setUnlimitedRerolls(!unlimitedRerolls);
              }}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.checkbox,
                  unlimitedRerolls && styles.checkboxChecked,
                ]}
              >
                {unlimitedRerolls && (
                  <ThemedText style={styles.checkmark}>✓</ThemedText>
                )}
              </View>
              <ThemedText style={styles.checkboxLabel}>
                {UI_TEXT.SETUP_UNLIMITED_REROLLS}
              </ThemedText>
            </TouchableOpacity>
          </LiquidGlassView>

          {/* Challenge Pack Selector */}
          <LiquidGlassView
            borderRadius={24}
            tintColor={GlassPalette.glassNeutral}
            borderColor={GlassPalette.specularBorderBright}
            style={styles.selectorContainer}
          >
            <View style={styles.cardHeaderRow}>
              <ThemedText type="subtitle" style={styles.label}>
                🥏 {UI_TEXT.SETUP_CHALLENGE_PACK}
              </ThemedText>
              <TouchableOpacity
                onPress={() => {
                  triggerLightHaptic();
                  router.push("/settings");
                }}
              >
                <ThemedText style={styles.customizeLinkText}>
                  {enabledStrings.length}/{allStrings.length} active →
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.packGrid}>
              {CHALLENGE_PACKS.map((pack) => {
                const isSelected = activePackId === pack.id;
                return (
                  <TouchableOpacity
                    key={pack.id}
                    style={styles.packCardTouch}
                    onPress={() => {
                      triggerLightHaptic();
                      applyPack(pack.id);
                    }}
                    activeOpacity={0.8}
                  >
                    <LiquidGlassView
                      interactive
                      effect={isSelected ? "regular" : "clear"}
                      borderRadius={16}
                      tintColor={
                        isSelected
                          ? GlassPalette.glassEmerald
                          : "rgba(255, 255, 255, 0.05)"
                      }
                      borderColor={
                        isSelected
                          ? GlassPalette.specularEmeraldRim
                          : GlassPalette.specularBorderSoft
                      }
                      style={styles.packCard}
                    >
                      <View style={styles.packCardHeader}>
                        <ThemedText style={styles.packEmoji}>
                          {pack.emoji}
                        </ThemedText>
                        {isSelected && (
                          <View style={styles.packActiveDot}>
                            <ThemedText style={styles.packActiveDotText}>
                              ✓
                            </ThemedText>
                          </View>
                        )}
                      </View>
                      <ThemedText
                        style={[
                          styles.packName,
                          isSelected && styles.packNameSelected,
                        ]}
                      >
                        {pack.name}
                      </ThemedText>
                      <ThemedText style={styles.packSubtitle} numberOfLines={2}>
                        {pack.subtitle}
                      </ThemedText>
                    </LiquidGlassView>
                  </TouchableOpacity>
                );
              })}
            </View>
          </LiquidGlassView>
        </GlassScrollView>

        <View
          style={[
            styles.bottomButtonContainer,
            { paddingBottom: Math.max(20, insets.bottom + 12) },
          ]}
        >
          <TouchableOpacity
            onPress={handleStartGame}
            activeOpacity={0.85}
          >
            <LiquidGlassView
              interactive
              borderRadius={20}
              tintColor={GlassPalette.glassLimeCTA}
              borderColor={GlassPalette.specularEmeraldRim}
              style={styles.continueButton}
            >
              <ThemedText style={styles.continueButtonText}>
                {UI_TEXT.SETUP_START_GAME}
              </ThemedText>
            </LiquidGlassView>
          </TouchableOpacity>
        </View>
      </GlassBackground>
    );
  }

  // Intro screen with continue/new game options
  return (
    <GlassBackground>
      <TouchableOpacity
        style={[
          styles.settingsButtonIntro,
          { top: Math.max(16, insets.top + 8) },
        ]}
        onPress={() => {
          triggerLightHaptic();
          router.push("/settings");
        }}
        activeOpacity={0.8}
      >
        <LiquidGlassView
          interactive
          borderRadius={20}
          tintColor={GlassPalette.glassEmerald}
          borderColor={GlassPalette.specularEmeraldRim}
          style={styles.modifiersPillButton}
        >
          <ThemedText style={styles.modifiersPillText}>⚙️ Modifiers</ThemedText>
        </LiquidGlassView>
      </TouchableOpacity>

      <View
        style={[
          styles.introContainer,
          { paddingTop: Math.max(40, insets.top + 20) },
        ]}
      >
        <LiquidGlassView
          borderRadius={44}
          tintColor="rgba(168, 230, 76, 0.14)"
          borderColor={GlassPalette.specularEmeraldRim}
          style={styles.logoFrame}
        >
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.introLogo}
            resizeMode="contain"
            accessibilityLabel={UI_TEXT.APP_TITLE}
          />
        </LiquidGlassView>

        <ThemedText style={styles.heroTitle}>{UI_TEXT.APP_TITLE}</ThemedText>
        <ThemedText style={styles.introTagline}>
          Roll a fresh shot challenge on every throw.
        </ThemedText>

        {hasSavedGame && savedGame && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleContinueSavedGame}
            style={{ width: "100%", marginTop: 24 }}
          >
            <LiquidGlassView
              interactive
              borderRadius={20}
              tintColor={GlassPalette.glassEmerald}
              borderColor={GlassPalette.specularEmeraldRim}
              style={styles.savedRoundBanner}
            >
              <View style={styles.savedRoundBadgePill}>
                <ThemedText style={styles.savedRoundBadge}>
                  ● ROUND IN PROGRESS
                </ThemedText>
              </View>
              <ThemedText style={styles.savedRoundTitle}>
                Hole {(savedGame.currentHole || 0) + 1} of {savedGame.numHoles}{" "}
                • {savedGame.players?.length || 1}{" "}
                {(savedGame.players?.length || 1) === 1 ? "Player" : "Players"}
              </ThemedText>
              <ThemedText style={styles.savedRoundPlayers} numberOfLines={1}>
                {savedGame.players?.map((p) => p.name).join(", ")}
              </ThemedText>
            </LiquidGlassView>
          </TouchableOpacity>
        )}
      </View>

      <LiquidGlassGroup
        spacing={14}
        style={[
          styles.buttonArea,
          { paddingBottom: Math.max(36, insets.bottom + 24) },
        ]}
      >
        {hasSavedGame && (
          <TouchableOpacity
            onPress={handleContinueSavedGame}
            activeOpacity={0.85}
          >
            <LiquidGlassView
              interactive
              borderRadius={20}
              tintColor={GlassPalette.glassLimeCTA}
              borderColor={GlassPalette.specularEmeraldRim}
              style={styles.continueButton}
            >
              <ThemedText style={styles.continueButtonText}>
                {UI_TEXT.INTRO_CONTINUE_GAME} 🥏
              </ThemedText>
            </LiquidGlassView>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleStartNewGame}
          activeOpacity={0.85}
        >
          <LiquidGlassView
            interactive
            effect={hasSavedGame ? "clear" : "regular"}
            borderRadius={20}
            tintColor={
              hasSavedGame
                ? GlassPalette.glassElevated
                : GlassPalette.glassLimeCTA
            }
            borderColor={
              hasSavedGame
                ? GlassPalette.specularBorderBright
                : GlassPalette.specularEmeraldRim
            }
            style={styles.continueButton}
          >
            <ThemedText
              style={[
                styles.continueButtonText,
                hasSavedGame && styles.newGameButtonText,
              ]}
            >
              {hasSavedGame
                ? UI_TEXT.INTRO_START_NEW_GAME
                : UI_TEXT.INTRO_LETS_PLAY}
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
      </LiquidGlassGroup>
    </GlassBackground>
  );
}
