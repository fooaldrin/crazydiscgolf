import { GlassBackground } from "@/components/glass-background";
import { GlassScrollView } from "@/components/glass-scroll-view";
import { LiquidGlassView } from "@/components/liquid-glass";
import { ThemedText } from "@/components/themed-text";
import { GlassPalette } from "@/constants/theme";
import { UI_TEXT } from "@/constants/ui-text";
import { useGamePersistence } from "@/hooks/use-game-persistence";
import { Player } from "@/types/game";
import { Slackey_400Regular, useFonts } from "@expo-google-fonts/slackey";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./names.styles";

const RECENT_NAMES_KEY = "@crazy_discgolf_recent_players";

export default function PlayerNamesScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { clearGameState } = useGamePersistence();

  const [fontsLoaded] = useFonts({
    Slackey_400Regular,
  });

  const numPlayers = parseInt(params.numPlayers as string, 10) || 1;
  const numHoles = parseInt(params.numHoles as string, 10) || 9;
  const maxRerollsParam = params.maxRerolls as string;
  const maxRerolls =
    maxRerollsParam !== undefined && maxRerollsParam !== null
      ? parseInt(maxRerollsParam, 10)
      : 3;

  const [players, setPlayers] = useState<Player[]>(() =>
    Array(numPlayers)
      .fill(null)
      .map((_, i) => ({
        name: `Player ${i + 1}`,
        scores: Array(numHoles).fill(""),
        rerollsUsed: 0,
        throwsPerHole: Array(numHoles)
          .fill(null)
          .map(() => []),
      })),
  );

  useEffect(() => {
    clearGameState();
    const loadRecentNames = async () => {
      try {
        const raw = await AsyncStorage.getItem(RECENT_NAMES_KEY);
        if (raw) {
          const savedNames: string[] = JSON.parse(raw);
          if (Array.isArray(savedNames) && savedNames.length > 0) {
            setPlayers((prev) =>
              prev.map((p, idx) => ({
                ...p,
                name: savedNames[idx]?.trim() || p.name,
              })),
            );
          }
        }
      } catch {
        // Ignore storage errors
      }
    };
    loadRecentNames();
  }, [clearGameState]);

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const startGame = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    const normalizedPlayers = players.map((p, idx) => ({
      ...p,
      name: p.name.trim() || `Player ${idx + 1}`,
    }));

    try {
      await AsyncStorage.setItem(
        RECENT_NAMES_KEY,
        JSON.stringify(normalizedPlayers.map((p) => p.name)),
      );
    } catch {
      // Ignore storage errors
    }

    const nextParams = {
      numPlayers: numPlayers.toString(),
      numHoles: numHoles.toString(),
      maxRerolls: maxRerolls.toString(),
      players: JSON.stringify(normalizedPlayers),
    };

    const queryString = Object.entries(nextParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    router.push(`/game?${queryString}` as any);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GlassBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.topBar,
            { paddingTop: Math.max(16, insets.top + 8) },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                () => {},
              );
              router.back();
            }}
            activeOpacity={0.8}
          >
            <LiquidGlassView
              interactive
              borderRadius={16}
              tintColor={GlassPalette.glassElevated}
              borderColor={GlassPalette.specularBorderBright}
              style={styles.backButton}
            >
              <ThemedText style={styles.backButtonText}>← Setup</ThemedText>
            </LiquidGlassView>
          </TouchableOpacity>

          <LiquidGlassView
            effect="clear"
            borderRadius={14}
            tintColor={GlassPalette.glassEmerald}
            borderColor={GlassPalette.specularEmeraldRim}
            style={styles.roundSummaryPill}
          >
            <ThemedText style={styles.roundSummaryBadge}>
              {numHoles} Holes •{" "}
              {maxRerolls === -1 ? "∞ Rerolls" : `${maxRerolls} Rerolls`}
            </ThemedText>
          </LiquidGlassView>
        </View>

        <GlassScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedText type="title" style={styles.title}>
            {UI_TEXT.NAMES_TITLE}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {UI_TEXT.NAMES_SUBTITLE}
          </ThemedText>

          {players.map((player, index) => (
            <LiquidGlassView
              key={index}
              borderRadius={20}
              tintColor={GlassPalette.glassNeutral}
              borderColor={GlassPalette.specularBorderBright}
              style={styles.inputContainer}
            >
              <ThemedText style={styles.inputLabel}>
                {UI_TEXT.NAMES_PLAYER_LABEL(index + 1)}
              </ThemedText>
              <TextInput
                style={styles.input}
                value={player.name}
                onChangeText={(text) => handlePlayerNameChange(index, text)}
                placeholder={UI_TEXT.NAMES_PLAYER_LABEL(index + 1)}
                placeholderTextColor="rgba(255, 255, 255, 0.38)"
                selectTextOnFocus
                returnKeyType={index === players.length - 1 ? "done" : "next"}
              />
            </LiquidGlassView>
          ))}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={startGame}
            style={styles.continueButtonTouch}
          >
            <LiquidGlassView
              interactive
              borderRadius={20}
              tintColor={GlassPalette.glassLimeCTA}
              borderColor={GlassPalette.specularEmeraldRim}
              style={styles.continueButton}
            >
              <ThemedText style={styles.continueButtonText}>
                {UI_TEXT.NAMES_CONTINUE}
              </ThemedText>
            </LiquidGlassView>
          </TouchableOpacity>
        </GlassScrollView>
      </KeyboardAvoidingView>
    </GlassBackground>
  );
}
