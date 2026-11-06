import { GlassBackground } from "@/components/glass-background";
import { GlassScrollView } from "@/components/glass-scroll-view";
import { LiquidGlassGroup, LiquidGlassView } from "@/components/liquid-glass";
import { ThemedText } from "@/components/themed-text";
import { CHALLENGE_CATEGORIES } from "@/constants/random-strings";
import { GlassPalette } from "@/constants/theme";
import { UI_TEXT } from "@/constants/ui-text";
import { useEnabledStrings } from "@/hooks/use-enabled-strings";
import { useGamePersistence } from "@/hooks/use-game-persistence";
import { Slackey_400Regular, useFonts } from "@expo-google-fonts/slackey";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./index.styles";

interface ThrowResult {
  throwNumber: number;
  result: string;
}

interface Player {
  name: string;
  scores: string[];
  rerollsUsed: number;
  throwsPerHole: ThrowResult[][];
}

interface UndoSnapshot {
  players: Player[];
  currentPlayerIndex: number;
  currentHole: number;
  currentThrow: number;
  currentRoll: string;
  playersFinishedCurrentHole: number[];
}

const REEL_ITEM_HEIGHT = 54;
const SPIN_DURATION_MS = 1650;

export default function GameScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { enabledStrings, allStrings, loading, refreshSettings } =
    useEnabledStrings();
  const { saveGameState, loadGameState, clearGameState } = useGamePersistence();
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    Slackey_400Regular,
  });

  const [numPlayers, setNumPlayers] = useState<number>(
    parseInt(params.numPlayers as string, 10) || 1,
  );
  const [numHoles, setNumHoles] = useState<number>(
    parseInt(params.numHoles as string, 10) || 9,
  );
  const maxRerollsParam = params.maxRerolls as string;
  const [maxRerolls, setMaxRerolls] = useState<number>(
    maxRerollsParam !== undefined && maxRerollsParam !== null
      ? parseInt(maxRerollsParam, 10)
      : 3,
  );

  const unlimitedRerolls = maxRerolls === -1;
  const [isInitialized, setIsInitialized] = useState(false);

  const initialPlayers: Player[] = useMemo(() => {
    if (params.players) {
      try {
        return JSON.parse(params.players as string);
      } catch {
        // Fallback below
      }
    }
    return Array(numPlayers)
      .fill(null)
      .map((_, i) => ({
        name: `Player ${i + 1}`,
        scores: Array(numHoles).fill(""),
        rerollsUsed: 0,
        throwsPerHole: Array(numHoles)
          .fill(null)
          .map(() => []),
      }));
  }, [numHoles, numPlayers, params.players]);

  const [screen, setScreen] = useState("game");
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentHole, setCurrentHole] = useState(0);
  const [currentThrow, setCurrentThrow] = useState(1);
  const [playersFinishedCurrentHole, setPlayersFinishedCurrentHole] = useState<
    Set<number>
  >(new Set());
  const [currentRoll, setCurrentRoll] = useState("");
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [showPlayerSelect, setShowPlayerSelect] = useState(false);
  const [showScorecardModal, setShowScorecardModal] = useState(false);
  const [showHoleTransition, setShowHoleTransition] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayRoll, setDisplayRoll] = useState("");
  const [animationProgress, setAnimationProgress] = useState(0);
  const [slotMachineList, setSlotMachineList] = useState<string[]>([]);
  const [undoStack, setUndoStack] = useState<UndoSnapshot[]>([]);

  const scrollAnim = useRef(new Animated.Value(0)).current;
  const descriptionOpacity = useRef(new Animated.Value(1)).current;
  const statsScrollViewRef = useRef<ScrollView>(null);
  const hapticTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pendingFinalRollRef = useRef<string>("");

  const clearHapticTimers = useCallback(() => {
    hapticTimersRef.current.forEach((t) => clearTimeout(t));
    hapticTimersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearHapticTimers();
  }, [clearHapticTimers]);

  // Function to get random string from enabled strings
  const getRandomString = useCallback(
    (excludeString?: string): string => {
      let availableStrings = enabledStrings.filter((option) => {
        return !option.minPlayers || numPlayers >= option.minPlayers;
      });

      if (excludeString && availableStrings.length > 1) {
        availableStrings = availableStrings.filter(
          (option) => option.name !== excludeString,
        );
      }

      if (availableStrings.length === 0) {
        return enabledStrings[0]?.name || UI_TEXT.DEFAULT_RANDOM_STRING;
      }

      const randomOption =
        availableStrings[Math.floor(Math.random() * availableStrings.length)];
      return randomOption.name;
    },
    [enabledStrings, numPlayers],
  );

  // Schedule decelerating haptic ticks during the slot machine spin
  const scheduleSpinHaptics = useCallback(() => {
    clearHapticTimers();
    const tickTimes = [90, 190, 300, 420, 560, 720, 900, 1110, 1350];
    tickTimes.forEach((ms) => {
      const timer = setTimeout(() => {
        Haptics.selectionAsync().catch(() => {});
      }, ms);
      hapticTimersRef.current.push(timer);
    });
  }, [clearHapticTimers]);

  // Animate through random strings before landing on final one
  const animateRoll = useCallback(
    (finalRoll: string) => {
      pendingFinalRollRef.current = finalRoll;
      setIsAnimating(true);
      setAnimationProgress(0);
      descriptionOpacity.setValue(0);

      const reelList: string[] = [];
      reelList.push(getRandomString());
      for (let i = 0; i < 18; i++) {
        reelList.push(getRandomString());
      }
      reelList.push(getRandomString(finalRoll));
      reelList.push(finalRoll);

      setSlotMachineList(reelList);
      scrollAnim.setValue(0);

      const totalDistance = (reelList.length - 1) * REEL_ITEM_HEIGHT;
      scheduleSpinHaptics();

      Animated.timing(scrollAnim, {
        toValue: totalDistance,
        duration: SPIN_DURATION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        clearHapticTimers();
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => {});
        setDisplayRoll(finalRoll);
        setIsAnimating(false);
        setAnimationProgress(0);

        Animated.timing(descriptionOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });

      const startTime = Date.now();
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / SPIN_DURATION_MS, 1);
        setAnimationProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(updateProgress);
        }
      };
      requestAnimationFrame(updateProgress);
    },
    [
      clearHapticTimers,
      descriptionOpacity,
      getRandomString,
      scheduleSpinHaptics,
      scrollAnim,
    ],
  );

  // Allow tapping the slot machine to skip animation on the course
  const handleSkipAnimation = () => {
    if (!isAnimating) return;
    clearHapticTimers();
    scrollAnim.stopAnimation();
    const finalRoll = pendingFinalRollRef.current || currentRoll;
    setDisplayRoll(finalRoll);
    setIsAnimating(false);
    setAnimationProgress(0);
    descriptionOpacity.setValue(1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  // Load saved game state on mount
  useEffect(() => {
    const initializeGame = async () => {
      const savedState = !params.players ? await loadGameState() : null;

      if (savedState && savedState.screen === "game") {
        const savedHoles = savedState.numHoles || numHoles;
        const savedPlayersCount =
          savedState.numPlayers || savedState.players.length || 1;
        setNumHoles(savedHoles);
        setNumPlayers(savedPlayersCount);

        const migratedPlayers = savedState.players.map((player) => ({
          ...player,
          throwsPerHole:
            player.throwsPerHole ||
            Array(savedHoles)
              .fill(null)
              .map(() => []),
        }));

        setScreen(savedState.screen);
        setPlayers(migratedPlayers);
        setCurrentPlayerIndex(savedState.currentPlayerIndex);
        setCurrentHole(savedState.currentHole);
        setCurrentThrow(savedState.currentThrow || 1);
        setCurrentRoll(savedState.currentRoll);
        setPlayersFinishedCurrentHole(
          new Set(savedState.playersFinishedCurrentHole || []),
        );
        setDisplayRoll(savedState.currentRoll);

        if (
          savedState.maxRerolls !== undefined &&
          savedState.maxRerolls !== null
        ) {
          setMaxRerolls(savedState.maxRerolls);
        }
      } else {
        if (numPlayers > 1) {
          setShowPlayerSelect(true);
        }
      }

      setIsInitialized(true);
    };

    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshSettings();
    }, [refreshSettings]),
  );

  // Check if current roll is still valid after settings change
  useEffect(() => {
    if (isInitialized && currentRoll && enabledStrings.length > 0 && !loading) {
      const currentOption = allStrings.find((s) => s.name === currentRoll);
      const isStillEnabled = currentOption
        ? enabledStrings.some((s) => s.id === currentOption.id)
        : false;

      if (!isStillEnabled) {
        const newRoll = getRandomString();
        setCurrentRoll(newRoll);
        animateRoll(newRoll);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabledStrings, isInitialized]);

  // Auto-save game state whenever it changes
  useEffect(() => {
    if (isInitialized && screen === "game") {
      const gameState = {
        screen: "game",
        numPlayers,
        numHoles,
        maxRerolls,
        players,
        currentPlayerIndex,
        currentHole,
        currentThrow,
        currentRoll,
        playersFinishedCurrentHole: Array.from(playersFinishedCurrentHole),
      };
      saveGameState(gameState);
    }
  }, [
    screen,
    numPlayers,
    numHoles,
    maxRerolls,
    players,
    currentPlayerIndex,
    currentHole,
    currentThrow,
    currentRoll,
    playersFinishedCurrentHole,
    isInitialized,
    saveGameState,
  ]);

  useEffect(() => {
    if (
      screen === "game" &&
      currentRoll === "" &&
      !loading &&
      !showPlayerSelect
    ) {
      const newRoll = getRandomString();
      setCurrentRoll(newRoll);
      animateRoll(newRoll);
    }
  }, [
    screen,
    currentPlayerIndex,
    currentHole,
    currentRoll,
    loading,
    showPlayerSelect,
    getRandomString,
    animateRoll,
  ]);

  const pushUndoSnapshot = () => {
    const clonedPlayers: Player[] = JSON.parse(JSON.stringify(players));
    setUndoStack((prev) => [
      ...prev.slice(-15),
      {
        players: clonedPlayers,
        currentPlayerIndex,
        currentHole,
        currentThrow,
        currentRoll,
        playersFinishedCurrentHole: Array.from(playersFinishedCurrentHole),
      },
    ]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0 || isAnimating) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setPlayers(last.players);
    setCurrentPlayerIndex(last.currentPlayerIndex);
    setCurrentHole(last.currentHole);
    setCurrentThrow(last.currentThrow);
    setCurrentRoll(last.currentRoll);
    setDisplayRoll(last.currentRoll);
    setPlayersFinishedCurrentHole(new Set(last.playersFinishedCurrentHole));
    setShowHoleTransition(false);
    setShowPlayerSelect(false);
  };

  const handleQuitGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setShowQuitConfirm(true);
  };

  const confirmQuit = async () => {
    await clearGameState();
    setShowQuitConfirm(false);
    router.replace("/");
  };

  const cancelQuit = () => {
    setShowQuitConfirm(false);
  };

  const handleSelectNextPlayer = (playerIndex: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setShowPlayerSelect(false);
    setCurrentPlayerIndex(playerIndex);
    const currentThrowCount =
      players[playerIndex].throwsPerHole[currentHole]?.length || 0;
    setCurrentThrow(currentThrowCount + 1);
    const newRoll = getRandomString();
    setCurrentRoll(newRoll);
    animateRoll(newRoll);
  };

  const advanceToNextHoleNow = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    const nextHole = currentHole + 1;
    setCurrentHole(nextHole);
    setCurrentThrow(1);
    setPlayersFinishedCurrentHole(new Set());
    setShowHoleTransition(false);

    if (numPlayers > 1) {
      setShowPlayerSelect(true);
    } else {
      setCurrentPlayerIndex(0);
      const newRoll = getRandomString();
      setCurrentRoll(newRoll);
      animateRoll(newRoll);
    }
  }, [animateRoll, currentHole, getRandomString, numPlayers]);

  if (!fontsLoaded) {
    return null;
  }

  // Helper function to compute total throws for a player across all holes so far
  const getPlayerTotalThrows = (player: Player) =>
    (player.throwsPerHole || []).reduce(
      (sum, holeThrows) => sum + (holeThrows?.length || 0),
      0,
    );

  // Render Modals (Quit Confirm, Player Select, Live Scorecard) with Apple Liquid Glass
  const renderModal = () => {
    if (showQuitConfirm) {
      return (
        <View style={styles.modalOverlay}>
          <BlurView
            intensity={36}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={cancelQuit}
          />
          <LiquidGlassView
            effect="regular"
            tintColor="rgba(12, 42, 26, 0.72)"
            borderColor={GlassPalette.specularEmeraldRim}
            borderRadius={26}
            style={styles.modalContent}
          >
            <ThemedText type="subtitle" style={styles.modalTitle}>
              {UI_TEXT.GAME_QUIT_CONFIRM_TITLE}
            </ThemedText>
            <ThemedText style={styles.modalMessage}>
              {UI_TEXT.GAME_QUIT_CONFIRM_MESSAGE}
            </ThemedText>
            <LiquidGlassGroup spacing={12} style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={cancelQuit}>
                <LiquidGlassView
                  effect="clear"
                  tintColor={GlassPalette.glassElevated}
                  borderColor={GlassPalette.specularBorderBright}
                  borderRadius={16}
                  interactive
                  style={styles.modalCancelButton}
                >
                  <Text style={styles.modalCancelText}>
                    {UI_TEXT.GAME_QUIT_CONFIRM_CANCEL}
                  </Text>
                </LiquidGlassView>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={confirmQuit}
              >
                <LiquidGlassView
                  effect="regular"
                  tintColor={GlassPalette.glassDanger}
                  borderColor="rgba(252, 165, 165, 0.65)"
                  borderRadius={16}
                  interactive
                  style={styles.modalQuitButton}
                >
                  <Text style={styles.modalQuitText}>
                    {UI_TEXT.GAME_QUIT_CONFIRM_QUIT}
                  </Text>
                </LiquidGlassView>
              </TouchableOpacity>
            </LiquidGlassGroup>
          </LiquidGlassView>
        </View>
      );
    }

    if (showScorecardModal) {
      const sortedStandings = players
        .map((p, idx) => ({
          player: p,
          idx,
          total: getPlayerTotalThrows(p),
          currentHoleThrows: p.throwsPerHole[currentHole]?.length || 0,
        }))
        .sort((a, b) => a.total - b.total);

      return (
        <View style={styles.modalOverlay}>
          <BlurView
            intensity={36}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowScorecardModal(false)}
          />
          <LiquidGlassView
            effect="regular"
            tintColor="rgba(12, 42, 26, 0.72)"
            borderColor={GlassPalette.specularEmeraldRim}
            borderRadius={26}
            style={styles.modalContent}
          >
            <ThemedText type="subtitle" style={styles.modalTitle}>
              📋 Live Card Standings
            </ThemedText>
            <ThemedText style={styles.modalMessage}>
              Through Hole {currentHole + 1} of {numHoles}
            </ThemedText>

            <View style={styles.scorecardList}>
              {sortedStandings.map((item, rankIdx) => (
                <View key={item.idx} style={styles.scorecardRow}>
                  <View style={styles.scorecardRankWrap}>
                    <ThemedText style={styles.scorecardRankText}>
                      #{rankIdx + 1}
                    </ThemedText>
                    <View>
                      <ThemedText style={styles.scorecardPlayerName}>
                        {item.player.name}
                      </ThemedText>
                      <ThemedText style={styles.scorecardSubText}>
                        Hole {currentHole + 1}: {item.currentHoleThrows}{" "}
                        {item.currentHoleThrows === 1 ? "throw" : "throws"}
                        {playersFinishedCurrentHole.has(item.idx)
                          ? " (in basket)"
                          : ""}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.scorecardTotalBadge}>
                    <ThemedText style={styles.scorecardTotalValue}>
                      {item.total}
                    </ThemedText>
                    <ThemedText style={styles.scorecardTotalLabel}>
                      throws
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setShowScorecardModal(false)}
              activeOpacity={0.85}
            >
              <LiquidGlassView
                effect="regular"
                tintColor={GlassPalette.glassLimeCTA}
                borderColor={GlassPalette.specularEmeraldRim}
                borderRadius={16}
                interactive
                style={styles.scorecardCloseBtn}
              >
                <ThemedText style={styles.scorecardCloseText}>
                  Back to Round
                </ThemedText>
              </LiquidGlassView>
            </TouchableOpacity>
          </LiquidGlassView>
        </View>
      );
    }

    if (showPlayerSelect) {
      const isStartOfHole = players.every(
        (p) => (p.throwsPerHole[currentHole]?.length || 0) === 0,
      );

      return (
        <View style={styles.modalOverlay}>
          <BlurView
            intensity={36}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} />
          <LiquidGlassView
            effect="regular"
            tintColor="rgba(12, 42, 26, 0.72)"
            borderColor={GlassPalette.specularEmeraldRim}
            borderRadius={26}
            style={styles.modalContent}
          >
            <ThemedText type="subtitle" style={styles.modalTitle}>
              {isStartOfHole
                ? UI_TEXT.PLAYER_SELECT_WHO_FIRST
                : UI_TEXT.PLAYER_SELECT_WHO_NEXT}
            </ThemedText>
            <ThemedText style={styles.modalMessage}>
              {isStartOfHole
                ? UI_TEXT.PLAYER_SELECT_TEE_OFF
                : UI_TEXT.PLAYER_SELECT_THROW_NEXT}
            </ThemedText>
            <LiquidGlassGroup spacing={10} style={styles.playerSelectList}>
              {players.map((player, index) => {
                const isFinished = playersFinishedCurrentHole.has(index);
                const throwCount =
                  player.throwsPerHole[currentHole]?.length || 0;

                if (isFinished) return null;

                const isCurrent = index === currentPlayerIndex && !isStartOfHole;

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    onPress={() => handleSelectNextPlayer(index)}
                  >
                    <LiquidGlassView
                      effect="regular"
                      tintColor={
                        isCurrent
                          ? GlassPalette.glassVioletActive
                          : GlassPalette.glassEmerald
                      }
                      borderColor={
                        isCurrent
                          ? "rgba(216, 180, 254, 0.65)"
                          : GlassPalette.specularEmeraldRim
                      }
                      borderRadius={16}
                      interactive
                      style={styles.playerSelectButton}
                    >
                      <View style={styles.playerSelectRow}>
                        <ThemedText style={styles.playerSelectName}>
                          {player.name}
                        </ThemedText>
                        <ThemedText style={styles.playerSelectThrows}>
                          {isStartOfHole
                            ? `Total: ${getPlayerTotalThrows(player)}`
                            : `${UI_TEXT.PLAYER_SELECT_THROWS(throwCount)} on hole`}
                        </ThemedText>
                      </View>
                    </LiquidGlassView>
                  </TouchableOpacity>
                );
              })}
            </LiquidGlassGroup>
          </LiquidGlassView>
        </View>
      );
    }

    return null;
  };

  // GAME SCREEN
  if (screen === "game") {
    if (showHoleTransition) {
      return (
        <GlassBackground variant="celebration">
          <View
            style={[
              styles.holeTransitionContainer,
              {
                paddingTop: Math.max(24, insets.top + 16),
                paddingBottom: Math.max(28, insets.bottom + 20),
              },
            ]}
          >
            <View style={styles.holeTransitionCenter}>
              <LiquidGlassView
                effect="regular"
                tintColor={GlassPalette.glassEmerald}
                borderColor={GlassPalette.specularEmeraldRim}
                borderRadius={999}
                style={styles.holeCompleteBadge}
              >
                <ThemedText style={styles.holeCompleteBadgeText}>
                  {UI_TEXT.HOLE_TRANSITION_COMPLETE(currentHole + 1)}
                </ThemedText>
              </LiquidGlassView>

              <ThemedText style={styles.holeTransitionText}>
                {UI_TEXT.HOLE_TRANSITION_TIME_FOR}
              </ThemedText>
              <ThemedText style={styles.holeTransitionNumber}>
                {UI_TEXT.HOLE_TRANSITION_HOLE(currentHole + 2)}
              </ThemedText>

              <LiquidGlassView
                effect="regular"
                tintColor={GlassPalette.glassElevated}
                borderColor={GlassPalette.specularBorderBright}
                borderRadius={24}
                style={styles.holeSummaryCard}
              >
                <ThemedText style={styles.holeSummaryTitle}>
                  Hole {currentHole + 1} Scores
                </ThemedText>
                {players.map((p, idx) => {
                  const holeThrows = p.throwsPerHole[currentHole]?.length || 0;
                  return (
                    <View key={idx} style={styles.holeSummaryRow}>
                      <ThemedText style={styles.holeSummaryPlayer}>
                        {p.name}
                      </ThemedText>
                      <ThemedText style={styles.holeSummaryScore}>
                        {holeThrows} {holeThrows === 1 ? "throw" : "throws"}{" "}
                        (Total: {getPlayerTotalThrows(p)})
                      </ThemedText>
                    </View>
                  );
                })}
              </LiquidGlassView>
            </View>

            <TouchableOpacity
              style={styles.holeTransitionNextBtnWrap}
              onPress={advanceToNextHoleNow}
              activeOpacity={0.85}
            >
              <LiquidGlassView
                effect="regular"
                tintColor={GlassPalette.glassLimeCTA}
                borderColor={GlassPalette.specularEmeraldRim}
                borderRadius={20}
                interactive
                style={styles.holeTransitionNextBtn}
              >
                <ThemedText style={styles.holeTransitionNextBtnText}>
                  {UI_TEXT.HOLE_TRANSITION_NEXT_BUTTON(currentHole + 2)}
                </ThemedText>
              </LiquidGlassView>
            </TouchableOpacity>
          </View>
        </GlassBackground>
      );
    }

    const currentPlayer = players[currentPlayerIndex] || players[0];
    const rerollsRemaining = unlimitedRerolls
      ? Infinity
      : maxRerolls - currentPlayer.rerollsUsed;
    const canReroll = unlimitedRerolls || rerollsRemaining > 0;

    const displayedRoll = displayRoll || currentRoll;
    const currentRollOption = allStrings.find((s) => s.name === displayedRoll);
    const categoryMeta =
      CHALLENGE_CATEGORIES[
        currentRollOption?.category ||
          (currentRollOption?.isCustom ? "custom" : "disc")
      ];

    const handleRollAgain = () => {
      if (canReroll && !isAnimating) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        const newRoll = getRandomString(currentRoll);
        setCurrentRoll(newRoll);
        animateRoll(newRoll);

        if (!unlimitedRerolls) {
          const newPlayers = [...players];
          newPlayers[currentPlayerIndex] = {
            ...newPlayers[currentPlayerIndex],
            rerollsUsed: newPlayers[currentPlayerIndex].rerollsUsed + 1,
          };
          setPlayers(newPlayers);
        }
      }
    };

    const handleContinue = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      pushUndoSnapshot();

      const newPlayers: Player[] = JSON.parse(JSON.stringify(players));
      if (!newPlayers[currentPlayerIndex].throwsPerHole[currentHole]) {
        newPlayers[currentPlayerIndex].throwsPerHole[currentHole] = [];
      }
      newPlayers[currentPlayerIndex].throwsPerHole[currentHole].push({
        throwNumber: currentThrow,
        result: currentRoll,
      });
      setPlayers(newPlayers);
      setCurrentThrow(currentThrow + 1);

      const activePlayers = newPlayers.filter(
        (_, idx) => !playersFinishedCurrentHole.has(idx),
      );

      if (
        activePlayers.length === 1 &&
        !playersFinishedCurrentHole.has(currentPlayerIndex)
      ) {
        const newRoll = getRandomString();
        setCurrentRoll(newRoll);
        animateRoll(newRoll);
        return;
      }

      if (numPlayers > 1) {
        setShowPlayerSelect(true);
      } else {
        const newRoll = getRandomString();
        setCurrentRoll(newRoll);
        animateRoll(newRoll);
      }
    };

    const handleFinishHole = async () => {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success,
      ).catch(() => {});
      pushUndoSnapshot();

      const newPlayers: Player[] = JSON.parse(JSON.stringify(players));
      newPlayers[currentPlayerIndex].scores[currentHole] = currentRoll;

      if (!newPlayers[currentPlayerIndex].throwsPerHole[currentHole]) {
        newPlayers[currentPlayerIndex].throwsPerHole[currentHole] = [];
      }
      newPlayers[currentPlayerIndex].throwsPerHole[currentHole].push({
        throwNumber: currentThrow,
        result: currentRoll,
      });
      setPlayers(newPlayers);

      const newFinishedPlayers = new Set(playersFinishedCurrentHole);
      newFinishedPlayers.add(currentPlayerIndex);
      setPlayersFinishedCurrentHole(newFinishedPlayers);

      const actualNumPlayers = newPlayers.length;

      if (newFinishedPlayers.size === actualNumPlayers) {
        if (currentHole < numHoles - 1) {
          setShowHoleTransition(true);
        } else {
          await clearGameState();
          setScreen("results");
        }
      } else {
        let nextPlayerIndex = (currentPlayerIndex + 1) % actualNumPlayers;
        let attempts = 0;
        while (
          newFinishedPlayers.has(nextPlayerIndex) &&
          attempts < actualNumPlayers
        ) {
          nextPlayerIndex = (nextPlayerIndex + 1) % actualNumPlayers;
          attempts++;
        }

        if (attempts >= actualNumPlayers) {
          setShowPlayerSelect(true);
          return;
        }

        setCurrentPlayerIndex(nextPlayerIndex);
        const nextPlayerThrows =
          newPlayers[nextPlayerIndex].throwsPerHole[currentHole]?.length || 0;
        setCurrentThrow(nextPlayerThrows + 1);
        const newRoll = getRandomString();
        setCurrentRoll(newRoll);
        animateRoll(newRoll);
      }
    };

    return (
      <GlassBackground variant="game">
        <View style={styles.container}>
          {/* Top Floating Liquid Glass HUD Bar */}
          <LiquidGlassGroup
            spacing={10}
            style={[
              styles.topHeaderBar,
              { paddingTop: Math.max(12, insets.top + 6) },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                  () => {},
                );
                setShowScorecardModal(true);
              }}
            >
              <LiquidGlassView
                effect="clear"
                tintColor={GlassPalette.glassNeutral}
                borderColor={GlassPalette.specularBorderBright}
                borderRadius={999}
                interactive
                style={styles.topUtilityPill}
              >
                <ThemedText style={styles.topUtilityPillText}>
                  {UI_TEXT.GAME_BUTTON_SCORECARD}
                </ThemedText>
              </LiquidGlassView>
            </TouchableOpacity>

            <LiquidGlassView
              effect="regular"
              tintColor={GlassPalette.glassEmerald}
              borderColor={GlassPalette.specularEmeraldRim}
              borderRadius={999}
              style={styles.holeBadgeCenter}
            >
              <ThemedText style={styles.holeBadgeText}>
                HOLE {currentHole + 1} / {numHoles}
              </ThemedText>
            </LiquidGlassView>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                  () => {},
                );
                router.push("/settings");
              }}
            >
              <LiquidGlassView
                effect="clear"
                tintColor={GlassPalette.glassNeutral}
                borderColor={GlassPalette.specularBorderBright}
                borderRadius={999}
                interactive
                style={styles.topUtilityPill}
              >
                <ThemedText style={styles.topUtilityPillText}>
                  ⚙️ Rules
                </ThemedText>
              </LiquidGlassView>
            </TouchableOpacity>
          </LiquidGlassGroup>

          <GlassScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
          >
            {/* Current Player Hero Header */}
            <View style={styles.playerCard}>
              <ThemedText type="title" style={styles.playerName}>
                {currentPlayer.name}
              </ThemedText>
              <View style={styles.throwPillRow}>
                <LiquidGlassView
                  effect="regular"
                  tintColor={GlassPalette.glassGoldCTA}
                  borderColor={GlassPalette.specularGoldRim}
                  borderRadius={999}
                  style={styles.throwBadge}
                >
                  <ThemedText style={styles.throwBadgeText}>
                    {UI_TEXT.GAME_THROW(currentThrow)}
                  </ThemedText>
                </LiquidGlassView>
                <ThemedText style={styles.totalStrokesSub}>
                  Round Total: {getPlayerTotalThrows(currentPlayer)}{" "}
                  {getPlayerTotalThrows(currentPlayer) === 1
                    ? "throw"
                    : "throws"}
                </ThemedText>
              </View>
            </View>

            {/* Multiplayer Card Status Strip */}
            {numPlayers > 1 && (
              <LiquidGlassView
                effect="regular"
                tintColor={GlassPalette.glassNeutral}
                borderColor={GlassPalette.specularBorderSoft}
                borderRadius={20}
                style={styles.playerStatusContainer}
              >
                <View style={styles.playerStatusList}>
                  {players.map((player, index) => {
                    const isFinished = playersFinishedCurrentHole.has(index);
                    const isActive = index === currentPlayerIndex;
                    const holeThrows =
                      player.throwsPerHole[currentHole]?.length || 0;
                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.75}
                        disabled={isFinished || isAnimating}
                        onPress={() => {
                          if (!isFinished && index !== currentPlayerIndex) {
                            handleSelectNextPlayer(index);
                          }
                        }}
                        style={styles.playerStatusItemWrap}
                      >
                        <LiquidGlassView
                          effect={isActive ? "regular" : "clear"}
                          tintColor={
                            isActive
                              ? GlassPalette.glassVioletActive
                              : "rgba(255, 255, 255, 0.06)"
                          }
                          borderColor={
                            isActive
                              ? "rgba(216, 180, 254, 0.65)"
                              : GlassPalette.specularBorderSoft
                          }
                          borderRadius={14}
                          interactive={!isFinished}
                          style={[
                            styles.playerStatusItem,
                            isFinished && styles.playerStatusItemFinished,
                          ]}
                        >
                          <ThemedText
                            numberOfLines={1}
                            style={[
                              styles.playerStatusName,
                              isActive && styles.playerStatusActive,
                              isFinished && styles.playerStatusFinished,
                            ]}
                          >
                            {isFinished ? "✓ " : ""}
                            {player.name}
                          </ThemedText>
                          <ThemedText style={styles.playerStatusThrowCount}>
                            {holeThrows}
                          </ThemedText>
                        </LiquidGlassView>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </LiquidGlassView>
            )}

            {/* Centerpiece 3D Liquid Glass Slot Machine Chamber */}
            <View style={styles.rollContainer}>
              <TouchableOpacity
                activeOpacity={isAnimating ? 0.88 : 1}
                onPress={handleSkipAnimation}
                style={styles.rollCardTouchable}
              >
                <LiquidGlassView
                  effect="regular"
                  tintColor={GlassPalette.glassElevated}
                  borderColor={GlassPalette.specularEmeraldRim}
                  borderRadius={28}
                  interactive={isAnimating}
                  style={styles.rollCardOuter}
                >
                  {/* Category Pill */}
                  <View
                    style={[
                      styles.categoryBadge,
                      {
                        backgroundColor: categoryMeta.bgColor,
                        borderColor: categoryMeta.borderColor,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.categoryBadgeText,
                        { color: categoryMeta.textColor },
                      ]}
                    >
                      {isAnimating
                        ? "🎰 ROLLING SHOT MODIFIER..."
                        : `${categoryMeta.emoji} ${categoryMeta.label.toUpperCase()}`}
                    </ThemedText>
                  </View>

                  {/* Recessed 3D Cylindrical Drum with Optical Vignettes */}
                  <View style={styles.rollResult}>
                    <LinearGradient
                      pointerEvents="none"
                      colors={["rgba(3, 12, 8, 0.82)", "rgba(3, 12, 8, 0.0)"]}
                      style={styles.drumVignetteTop}
                    />
                    <LinearGradient
                      pointerEvents="none"
                      colors={["rgba(3, 12, 8, 0.0)", "rgba(3, 12, 8, 0.82)"]}
                      style={styles.drumVignetteBottom}
                    />

                    {isAnimating ? (
                      <>
                        <View style={styles.slotMachineContainer}>
                          <Animated.View
                            style={[
                              styles.slotMachineReel,
                              {
                                transform: [
                                  {
                                    translateY: Animated.multiply(
                                      scrollAnim,
                                      -1,
                                    ),
                                  },
                                ],
                              },
                            ]}
                          >
                            {slotMachineList.map((item, index) => (
                              <View key={index} style={styles.slotMachineItem}>
                                <Text
                                  style={styles.rollText}
                                  numberOfLines={1}
                                  adjustsFontSizeToFit
                                >
                                  {item}
                                </Text>
                              </View>
                            ))}
                          </Animated.View>
                        </View>
                        <View style={styles.progressBarContainer}>
                          <View style={styles.progressBarBackground}>
                            <View
                              style={[
                                styles.progressBarFill,
                                { width: `${animationProgress * 100}%` },
                              ]}
                            />
                          </View>
                          <ThemedText style={styles.tapToSkipHint}>
                            Tap chamber to skip spin
                          </ThemedText>
                        </View>
                      </>
                    ) : (
                      <View style={styles.slotMachineContainer}>
                        <View style={styles.slotMachineItem}>
                          <Text
                            style={styles.rollText}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                          >
                            {displayedRoll}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>

                  {currentRollOption && !isAnimating && (
                    <Animated.Text
                      style={[
                        styles.rollDescription,
                        { opacity: descriptionOpacity },
                      ]}
                    >
                      {currentRollOption.description}
                    </Animated.Text>
                  )}
                </LiquidGlassView>
              </TouchableOpacity>
            </View>
          </GlassScrollView>

          {/* Bottom Liquid Glass Action Dock (Zero Ads!) */}
          <View
            style={[
              styles.bottomButtonContainer,
              { paddingBottom: Math.max(16, insets.bottom + 8) },
            ]}
          >
            <LiquidGlassGroup spacing={12} style={styles.buttonContainer}>
              <View style={styles.primaryActionsRow}>
                <TouchableOpacity
                  style={[
                    styles.halfButton,
                    isAnimating && styles.disabledButtonWrap,
                  ]}
                  onPress={handleContinue}
                  disabled={isAnimating}
                  activeOpacity={0.85}
                >
                  <LiquidGlassView
                    effect="regular"
                    tintColor={GlassPalette.glassLimeCTA}
                    borderColor={GlassPalette.specularEmeraldRim}
                    borderRadius={20}
                    interactive={!isAnimating}
                    style={styles.gameButtonGlass}
                  >
                    <ThemedText style={styles.gameButtonText}>
                      {UI_TEXT.GAME_BUTTON_NEXT_SHOT}
                    </ThemedText>
                  </LiquidGlassView>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.halfButton,
                    isAnimating && styles.disabledButtonWrap,
                  ]}
                  onPress={handleFinishHole}
                  disabled={isAnimating}
                  activeOpacity={0.85}
                >
                  <LiquidGlassView
                    effect="regular"
                    tintColor={GlassPalette.glassGoldCTA}
                    borderColor={GlassPalette.specularGoldRim}
                    borderRadius={20}
                    interactive={!isAnimating}
                    style={styles.gameButtonGlass}
                  >
                    <ThemedText style={styles.inBasketButtonText}>
                      {UI_TEXT.GAME_BUTTON_IN_BASKET}
                    </ThemedText>
                  </LiquidGlassView>
                </TouchableOpacity>
              </View>

              {(maxRerolls > 0 || unlimitedRerolls) && (
                <TouchableOpacity
                  style={
                    (!canReroll || isAnimating) && styles.disabledButtonWrap
                  }
                  onPress={handleRollAgain}
                  disabled={!canReroll || isAnimating}
                  activeOpacity={0.85}
                >
                  <LiquidGlassView
                    effect="clear"
                    tintColor={GlassPalette.glassNeutral}
                    borderColor={GlassPalette.specularBorderBright}
                    borderRadius={18}
                    interactive={canReroll && !isAnimating}
                    style={styles.rollButtonGlass}
                  >
                    <ThemedText style={styles.rollButtonText}>
                      {unlimitedRerolls
                        ? UI_TEXT.GAME_BUTTON_ROLL_AGAIN
                        : canReroll
                          ? UI_TEXT.GAME_BUTTON_ROLL_AGAIN_COUNT(
                              rerollsRemaining,
                              maxRerolls,
                            )
                          : UI_TEXT.GAME_BUTTON_NO_REROLLS}
                    </ThemedText>
                  </LiquidGlassView>
                </TouchableOpacity>
              )}
            </LiquidGlassGroup>

            <View style={styles.bottomFooterLinks}>
              {undoStack.length > 0 && (
                <TouchableOpacity
                  onPress={handleUndo}
                  disabled={isAnimating}
                  activeOpacity={0.8}
                >
                  <LiquidGlassView
                    effect="clear"
                    tintColor="rgba(252, 174, 36, 0.16)"
                    borderColor={GlassPalette.specularGoldRim}
                    borderRadius={999}
                    interactive
                    style={styles.footerGlassPill}
                  >
                    <ThemedText style={styles.undoButtonText}>
                      {UI_TEXT.GAME_BUTTON_UNDO}
                    </ThemedText>
                  </LiquidGlassView>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={handleQuitGame} activeOpacity={0.8}>
                <LiquidGlassView
                  effect="clear"
                  tintColor="rgba(255, 255, 255, 0.06)"
                  borderColor={GlassPalette.specularBorderSoft}
                  borderRadius={999}
                  interactive
                  style={styles.footerGlassPill}
                >
                  <ThemedText style={styles.quitButtonText}>
                    {UI_TEXT.GAME_BUTTON_QUIT}
                  </ThemedText>
                </LiquidGlassView>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {renderModal()}
      </GlassBackground>
    );
  }

  // RESULTS SCREEN
  if (screen === "results") {
    const handlePlayAgain = async () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      await clearGameState();
      router.replace("/");
    };

    const handleRematchSameCard = async () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      await clearGameState();
      const freshPlayers: Player[] = players.map((p) => ({
        name: p.name,
        scores: Array(numHoles).fill(""),
        rerollsUsed: 0,
        throwsPerHole: Array(numHoles)
          .fill(null)
          .map(() => []),
      }));
      setPlayers(freshPlayers);
      setCurrentHole(0);
      setCurrentThrow(1);
      setCurrentPlayerIndex(0);
      setPlayersFinishedCurrentHole(new Set());
      setUndoStack([]);
      setScreen("game");
      if (numPlayers > 1) {
        setShowPlayerSelect(true);
      } else {
        const newRoll = getRandomString();
        setCurrentRoll(newRoll);
        animateRoll(newRoll);
      }
    };

    const handlePlayerTabChange = (index: number) => {
      Haptics.selectionAsync().catch(() => {});
      setSelectedPlayerIndex(index);
      setTimeout(() => {
        statsScrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
      }, 0);
    };

    // Compute ranked leaderboard
    const leaderboard = players
      .map((player, index) => {
        const throwsArr = player.throwsPerHole || [];
        const total = throwsArr.reduce(
          (sum, h) => sum + (h?.length || 0),
          0,
        );
        const holeCounts = throwsArr
          .map((h) => h?.length || 0)
          .filter((c) => c > 0);
        const bestHole =
          holeCounts.length > 0 ? Math.min(...holeCounts) : 0;
        const avg =
          numHoles > 0 ? (total / numHoles).toFixed(1) : "0.0";
        return {
          player,
          index,
          total,
          bestHole,
          avg,
        };
      })
      .sort((a, b) => a.total - b.total);

    const selectedEntry =
      leaderboard.find((e) => e.index === selectedPlayerIndex) ||
      leaderboard[0];
    const selectedPlayer = selectedEntry.player;

    const getMedal = (rankIndex: number) => {
      if (rankIndex === 0) return "🥇";
      if (rankIndex === 1) return "🥈";
      if (rankIndex === 2) return "🥉";
      return `#${rankIndex + 1}`;
    };

    const getPodiumTint = (rankIndex: number, isSelected: boolean) => {
      if (isSelected) return GlassPalette.glassEmerald;
      if (rankIndex === 0) return "rgba(252, 174, 36, 0.22)";
      if (rankIndex === 1) return "rgba(226, 232, 240, 0.16)";
      if (rankIndex === 2) return "rgba(244, 127, 29, 0.18)";
      return "rgba(255, 255, 255, 0.08)";
    };

    const getPodiumBorder = (rankIndex: number, isSelected: boolean) => {
      if (isSelected) return GlassPalette.specularEmeraldRim;
      if (rankIndex === 0) return GlassPalette.specularGoldRim;
      if (rankIndex === 1) return "rgba(226, 232, 240, 0.45)";
      if (rankIndex === 2) return "rgba(251, 146, 60, 0.48)";
      return GlassPalette.specularBorderSoft;
    };

    return (
      <GlassBackground variant="celebration">
        <View style={styles.container}>
          <View
            style={[
              styles.content,
              {
                paddingTop: Math.max(20, insets.top + 12),
                paddingBottom: Math.max(20, insets.bottom + 12),
              },
            ]}
          >
            <ThemedText type="title" style={styles.title}>
              🏆 {UI_TEXT.RESULTS_TITLE}
            </ThemedText>

            <GlassScrollView
              ref={statsScrollViewRef}
              containerStyle={styles.statsScrollView}
            >
              {/* Standings / Podium Leaderboard */}
              <LiquidGlassView
                effect="regular"
                tintColor={GlassPalette.glassNeutral}
                borderColor={GlassPalette.specularBorderBright}
                borderRadius={24}
                style={styles.leaderboardCard}
              >
                <ThemedText style={styles.leaderboardHeaderTitle}>
                  {UI_TEXT.RESULTS_LEADERBOARD} ({numHoles} Holes)
                </ThemedText>
                {leaderboard.map((entry, rankIdx) => {
                  const isSelected = entry.index === selectedPlayerIndex;
                  return (
                    <TouchableOpacity
                      key={entry.index}
                      activeOpacity={0.82}
                      onPress={() => handlePlayerTabChange(entry.index)}
                    >
                      <LiquidGlassView
                        effect={isSelected ? "regular" : "clear"}
                        tintColor={getPodiumTint(rankIdx, isSelected)}
                        borderColor={getPodiumBorder(rankIdx, isSelected)}
                        borderRadius={16}
                        interactive
                        style={styles.leaderboardRow}
                      >
                        <View style={styles.leaderboardLeft}>
                          <ThemedText style={styles.leaderboardMedal}>
                            {getMedal(rankIdx)}
                          </ThemedText>
                          <View>
                            <ThemedText style={styles.leaderboardPlayerName}>
                              {entry.player.name}
                            </ThemedText>
                            <ThemedText style={styles.leaderboardSubStats}>
                              Avg {entry.avg}/hole • {entry.player.rerollsUsed}{" "}
                              {entry.player.rerollsUsed === 1
                                ? "reroll"
                                : "rerolls"}
                            </ThemedText>
                          </View>
                        </View>
                        <View style={styles.leaderboardRight}>
                          <ThemedText style={styles.leaderboardTotalValue}>
                            {entry.total}
                          </ThemedText>
                          <ThemedText style={styles.leaderboardTotalLabel}>
                            throws
                          </ThemedText>
                        </View>
                      </LiquidGlassView>
                    </TouchableOpacity>
                  );
                })}
              </LiquidGlassView>

              {/* Player Tabs for Hole-by-Hole Breakdown */}
              {numPlayers > 1 && (
                <View style={styles.tabsWrapper}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.tabsContainer}
                    contentContainerStyle={styles.tabsContentContainer}
                  >
                    {players.map((player, index) => {
                      const active = selectedPlayerIndex === index;
                      return (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.8}
                          onPress={() => handlePlayerTabChange(index)}
                        >
                          <LiquidGlassView
                            effect={active ? "regular" : "clear"}
                            tintColor={
                              active
                                ? GlassPalette.glassEmerald
                                : GlassPalette.glassNeutral
                            }
                            borderColor={
                              active
                                ? GlassPalette.specularEmeraldRim
                                : GlassPalette.specularBorderSoft
                            }
                            borderRadius={999}
                            interactive
                            style={styles.tab}
                          >
                            <ThemedText
                              style={[
                                styles.tabText,
                                active && styles.tabTextActive,
                              ]}
                            >
                              {player.name}
                            </ThemedText>
                          </LiquidGlassView>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* Selected Player Summary Metrics */}
              <LiquidGlassGroup spacing={10} style={styles.metricsGrid}>
                <LiquidGlassView
                  effect="regular"
                  tintColor={GlassPalette.glassNeutral}
                  borderColor={GlassPalette.specularBorderSoft}
                  borderRadius={18}
                  style={styles.metricBox}
                >
                  <ThemedText style={styles.metricValue}>
                    {selectedEntry.total}
                  </ThemedText>
                  <ThemedText style={styles.metricLabel}>
                    {UI_TEXT.RESULTS_TOTAL_THROWS}
                  </ThemedText>
                </LiquidGlassView>
                <LiquidGlassView
                  effect="regular"
                  tintColor={GlassPalette.glassNeutral}
                  borderColor={GlassPalette.specularBorderSoft}
                  borderRadius={18}
                  style={styles.metricBox}
                >
                  <ThemedText style={styles.metricValue}>
                    {selectedEntry.avg}
                  </ThemedText>
                  <ThemedText style={styles.metricLabel}>
                    {UI_TEXT.RESULTS_AVERAGE}
                  </ThemedText>
                </LiquidGlassView>
                <LiquidGlassView
                  effect="regular"
                  tintColor={GlassPalette.glassNeutral}
                  borderColor={GlassPalette.specularBorderSoft}
                  borderRadius={18}
                  style={styles.metricBox}
                >
                  <ThemedText style={styles.metricValue}>
                    {selectedEntry.bestHole || "-"}
                  </ThemedText>
                  <ThemedText style={styles.metricLabel}>
                    {UI_TEXT.RESULTS_BEST_HOLE}
                  </ThemedText>
                </LiquidGlassView>
              </LiquidGlassGroup>

              {/* Hole-by-Hole Breakdown */}
              {selectedPlayer.scores.map((_, holeIndex) => {
                const holeThrows =
                  selectedPlayer.throwsPerHole?.[holeIndex] || [];

                return (
                  <LiquidGlassView
                    key={holeIndex}
                    effect="clear"
                    tintColor={GlassPalette.glassNeutral}
                    borderColor={GlassPalette.specularBorderSoft}
                    borderRadius={18}
                    style={styles.holeDetailCard}
                  >
                    <View style={styles.holeDetailHeader}>
                      <ThemedText style={styles.holeDetailTitle}>
                        {UI_TEXT.RESULTS_HOLE(holeIndex + 1)}
                      </ThemedText>
                      <View style={styles.holeDetailScorePill}>
                        <ThemedText style={styles.holeDetailScore}>
                          {UI_TEXT.RESULTS_THROWS_COUNT(holeThrows.length)}
                        </ThemedText>
                      </View>
                    </View>

                    {holeThrows.length > 0 && (
                      <View style={styles.throwsList}>
                        {holeThrows.map((throwData, throwIndex) => (
                          <View key={throwIndex} style={styles.throwItem}>
                            <ThemedText style={styles.throwNumber}>
                              #{throwIndex + 1}
                            </ThemedText>
                            <ThemedText style={styles.throwResult}>
                              {throwData.result}
                            </ThemedText>
                          </View>
                        ))}
                      </View>
                    )}
                  </LiquidGlassView>
                );
              })}
            </GlassScrollView>

            <LiquidGlassGroup spacing={10} style={styles.resultsButtonsStack}>
              <TouchableOpacity
                onPress={handleRematchSameCard}
                activeOpacity={0.85}
              >
                <LiquidGlassView
                  effect="regular"
                  tintColor={GlassPalette.glassLimeCTA}
                  borderColor={GlassPalette.specularEmeraldRim}
                  borderRadius={20}
                  interactive
                  style={styles.rematchButton}
                >
                  <ThemedText style={styles.rematchButtonText}>
                    {UI_TEXT.RESULTS_REMATCH}
                  </ThemedText>
                </LiquidGlassView>
              </TouchableOpacity>

              <TouchableOpacity onPress={handlePlayAgain} activeOpacity={0.85}>
                <LiquidGlassView
                  effect="clear"
                  tintColor={GlassPalette.glassNeutral}
                  borderColor={GlassPalette.specularBorderBright}
                  borderRadius={18}
                  interactive
                  style={styles.continueButton}
                >
                  <ThemedText style={styles.continueButtonText}>
                    {UI_TEXT.RESULTS_PLAY_AGAIN}
                  </ThemedText>
                </LiquidGlassView>
              </TouchableOpacity>
            </LiquidGlassGroup>
          </View>
        </View>
      </GlassBackground>
    );
  }

  return null;
}
