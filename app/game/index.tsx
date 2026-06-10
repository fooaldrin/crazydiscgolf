import { BANNER_AD_HEIGHT, BannerAd, useInterstitialAd } from '@/components/ads';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UI_TEXT } from '@/constants/ui-text';
import { useEnabledStrings } from '@/hooks/use-enabled-strings';
import { useGamePersistence } from '@/hooks/use-game-persistence';
import { useThrowCounter } from '@/hooks/use-throw-counter';
import { Slackey_400Regular, useFonts } from '@expo-google-fonts/slackey';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './index.styles';

interface ThrowResult {
  throwNumber: number;
  result: string;
}

interface Player {
  name: string;
  scores: string[]; // Array of strings (one per hole)
  rerollsUsed: number; // Track rerolls used per player
  throwsPerHole: ThrowResult[][]; // Track throws for each hole [hole][throw]
}

export default function GameScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { enabledStrings, allStrings, loading, refreshSettings } = useEnabledStrings();
  const { saveGameState, loadGameState, clearGameState } = useGamePersistence();
  const insets = useSafeAreaInsets();
  
  // AdMob Integration
  const { isAdReady, showAd } = useInterstitialAd();
  const { shouldShowAd, incrementThrow, resetCounter } = useThrowCounter(20); // Show video ad every 20 throws
  
  const [fontsLoaded] = useFonts({
    Slackey_400Regular,
  });
  
  const numPlayers = parseInt(params.numPlayers as string) || 1;
  const numHoles = parseInt(params.numHoles as string) || 9;
  const maxRerollsParam = params.maxRerolls as string;
  const [maxRerolls, setMaxRerolls] = useState<number>(
    maxRerollsParam !== undefined && maxRerollsParam !== null 
      ? parseInt(maxRerollsParam) 
      : 3
  );
  
  const unlimitedRerolls = maxRerolls === -1;
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Parse players from params or create default
  const initialPlayers: Player[] = params.players 
    ? JSON.parse(params.players as string)
    : Array(numPlayers).fill(null).map((_, i) => ({
        name: `Player ${i + 1}`,
        scores: Array(numHoles).fill(''),
        rerollsUsed: 0,
        throwsPerHole: Array(numHoles).fill(null).map(() => [])
      }));
  
  const [screen, setScreen] = useState('game'); // Always start in game mode
  
  // Function to get random string from enabled strings
  const getRandomString = (excludeString?: string): string => {
    // Filter strings based on minimum player requirements
    let availableStrings = enabledStrings.filter(option => {
      // If minPlayers is not set or numPlayers meets the requirement, include it
      return !option.minPlayers || numPlayers >= option.minPlayers;
    });
    
    // If we need to exclude a string and there's more than one option
    if (excludeString && availableStrings.length > 1) {
      availableStrings = availableStrings.filter(option => option.name !== excludeString);
    }
    
    // Fallback to first available string if no strings pass the filter
    if (availableStrings.length === 0) {
      return enabledStrings[0]?.name || UI_TEXT.DEFAULT_RANDOM_STRING;
    }
    
    const randomOption = availableStrings[Math.floor(Math.random() * availableStrings.length)];
    return randomOption.name;
  };
  // Animate through random strings before landing on final one
  const animateRoll = (finalRoll: string) => {
    setIsAnimating(true);
    setAnimationProgress(0);
    
    // Reset description opacity
    descriptionOpacity.setValue(0);
    
    // Create a list of random strings with the final roll at the end
    const reelList: string[] = [];
    
    // Add the first visible item
    reelList.push(getRandomString());
    
    // Add more random items that will scroll past (24 items)
    for (let i = 0; i < 24; i++) {
      reelList.push(getRandomString());
    }
    
    // Add the second-to-last item (make sure it's different from final)
    reelList.push(getRandomString(finalRoll));
    
    // Add the final result
    reelList.push(finalRoll);
    
    setSlotMachineList(reelList);
    
    // Reset scroll position to top
    const itemHeight = 28; // Match the lineHeight of the text
    scrollAnim.setValue(0);
    
    // Calculate total scroll distance 
    // Container is 28px tall, items are 28px tall
    // To show the last item perfectly in the window, scroll (items - 1) * height
    // This brings the last item's top edge to the container's top edge
    const totalDistance = (reelList.length - 1) * itemHeight;
    
    // Animate scrolling with easing
    Animated.timing(scrollAnim, {
      toValue: totalDistance,
      duration: 3000, // 3 seconds for smooth casino effect
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      // Animation complete - now set the final roll for description
      setDisplayRoll(finalRoll);
      setIsAnimating(false);
      setAnimationProgress(0);
      
      // Fade in the description
      Animated.timing(descriptionOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
    
    // Update progress bar separately
    const startTime = Date.now();
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 3000, 1);
      setAnimationProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(updateProgress);
      }
    };
    requestAnimationFrame(updateProgress);
  };
  
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentHole, setCurrentHole] = useState(0);
  const [currentThrow, setCurrentThrow] = useState(1); // Track current throw number
  const [playersFinishedCurrentHole, setPlayersFinishedCurrentHole] = useState<Set<number>>(new Set());
  const [currentRoll, setCurrentRoll] = useState('');
  const [currentRollId, setCurrentRollId] = useState(''); // Track the ID to detect actual disabling vs editing
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [showPlayerSelect, setShowPlayerSelect] = useState(false);
  const [showHoleTransition, setShowHoleTransition] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0); // For results page tabs
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayRoll, setDisplayRoll] = useState('');
  const [animationProgress, setAnimationProgress] = useState(0);
  const [slotMachineList, setSlotMachineList] = useState<string[]>([]);
  
  // Animated value for slot machine scroll
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  
  // Ref for results page stats scroll view
  const statsScrollViewRef = useRef<ScrollView>(null);

  // Load saved game state on mount
  useEffect(() => {
    const initializeGame = async () => {
      const savedState = await loadGameState();
      
      if (savedState && savedState.screen === 'game') {
        // Migrate old player data to include throwsPerHole if missing
        const migratedPlayers = savedState.players.map(player => ({
          ...player,
          throwsPerHole: player.throwsPerHole || Array(numHoles).fill(null).map(() => [])
        }));
        
        // Restore saved game state
        setScreen(savedState.screen);
        setPlayers(migratedPlayers);
        setCurrentPlayerIndex(savedState.currentPlayerIndex);
        setCurrentHole(savedState.currentHole);
        setCurrentThrow(savedState.currentThrow || 1);
        setCurrentRoll(savedState.currentRoll);
        setPlayersFinishedCurrentHole(new Set(savedState.playersFinishedCurrentHole || []));
        setDisplayRoll(savedState.currentRoll); // Show saved roll immediately without animation
        
        // Restore maxRerolls from saved state if available
        if (savedState.maxRerolls !== undefined && savedState.maxRerolls !== null) {
          setMaxRerolls(savedState.maxRerolls);
        }
      } else {
        // Starting a new game - show player selection modal if multiplayer
        if (numPlayers > 1) {
          setShowPlayerSelect(true);
        }
      }
      
      setIsInitialized(true);
    };
    
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh settings when screen comes back into focus (after returning from settings)
  useFocusEffect(
    useCallback(() => {
      refreshSettings();
    }, [refreshSettings])
  );

  // Check if current roll is still valid after settings change, reroll if not
  useEffect(() => {
    if (isInitialized && currentRoll && enabledStrings.length > 0 && !loading) {
      // Find the option that matches the current roll name
      const currentOption = allStrings.find(s => s.name === currentRoll);
      
      // Check if that option (by ID) is still enabled
      // This handles name changes - as long as the ID is still enabled, don't reroll
      const isStillEnabled = currentOption ? 
        enabledStrings.some(s => s.id === currentOption.id) : 
        false;
      
      // Only reroll if the option was actually disabled, not just renamed
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
    if (isInitialized) {
      const gameState = {
        screen: typeof screen === 'string' ? screen : screen[0],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, players, currentPlayerIndex, currentHole, currentThrow, currentRoll, playersFinishedCurrentHole, isInitialized]);

  useEffect(() => {
    if (screen === 'game' && currentRoll === '' && !loading && !showPlayerSelect) {
      const newRoll = getRandomString();
      setCurrentRoll(newRoll);
      animateRoll(newRoll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, currentPlayerIndex, currentHole, currentRoll, loading, showPlayerSelect]);

  // Handle quitting the game
  const handleQuitGame = () => {
    setShowQuitConfirm(true);
  };

  const confirmQuit = async () => {
    await clearGameState();
    setShowQuitConfirm(false);
    router.push('/');
  };

  const cancelQuit = () => {
    setShowQuitConfirm(false);
  };
  
  const handleSelectNextPlayer = (playerIndex: number) => {
    setShowPlayerSelect(false);
    setCurrentPlayerIndex(playerIndex);
    // Calculate throw number - if array doesn't exist yet, start at 1
    const currentThrowCount = players[playerIndex].throwsPerHole[currentHole]?.length || 0;
    setCurrentThrow(currentThrowCount + 1);
    const newRoll = getRandomString();
    setCurrentRoll(newRoll);
    animateRoll(newRoll);
  };
  
  // Wait for fonts to load
  if (!fontsLoaded) {
    return null;
  }

  // Helper function to render modal
  const renderModal = () => {
    if (showQuitConfirm) {
      return (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={cancelQuit}
          />
          <View style={styles.modalContent}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              {UI_TEXT.GAME_QUIT_CONFIRM_TITLE}
            </ThemedText>
            <ThemedText style={styles.modalMessage}>
              {UI_TEXT.GAME_QUIT_CONFIRM_MESSAGE}
            </ThemedText>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={cancelQuit}
              >
                <View style={styles.modalCancelButton}>
                  <Text style={styles.modalCancelText}>{UI_TEXT.GAME_QUIT_CONFIRM_CANCEL}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={confirmQuit}
              >
                <View style={styles.modalQuitButton}>
                  <Text style={styles.modalQuitText}>{UI_TEXT.GAME_QUIT_CONFIRM_QUIT}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    
    if (showPlayerSelect) {
      // Check if this is the start of a hole (no one has thrown yet)
      const isStartOfHole = players.every(p => (p.throwsPerHole[currentHole]?.length || 0) === 0);
      
      return (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
          />
          <View style={styles.modalContent}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              {isStartOfHole ? UI_TEXT.PLAYER_SELECT_WHO_FIRST : UI_TEXT.PLAYER_SELECT_WHO_NEXT}
            </ThemedText>
            <ThemedText style={styles.modalMessage}>
              {isStartOfHole 
                ? UI_TEXT.PLAYER_SELECT_TEE_OFF 
                : UI_TEXT.PLAYER_SELECT_THROW_NEXT}
            </ThemedText>
            <View style={styles.playerSelectList}>
              {players.map((player, index) => {
                const isFinished = playersFinishedCurrentHole.has(index);
                const throwCount = player.throwsPerHole[currentHole]?.length || 0;
                
                if (isFinished) return null;
                
                return (
                  <TouchableOpacity 
                    key={index}
                    style={[
                      styles.playerSelectButton,
                      index === currentPlayerIndex && !isStartOfHole && styles.playerSelectButtonCurrent
                    ]}
                    onPress={() => handleSelectNextPlayer(index)}
                  >
                    <ThemedText style={styles.playerSelectName}>{player.name}</ThemedText>
                    {!isStartOfHole && (
                      <ThemedText style={styles.playerSelectThrows}>
                        {UI_TEXT.PLAYER_SELECT_THROWS(throwCount)} so far
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      );
    }
    
    return null;
  };

  // GAME SCREEN
  if (screen === 'game') {
    // Show hole transition screen if moving to next hole
    if (showHoleTransition) {
      return (
        <ThemedView style={styles.holeTransitionContainer}>
          <ThemedText style={styles.holeTransitionText}>{UI_TEXT.HOLE_TRANSITION_TIME_FOR}</ThemedText>
          <ThemedText style={styles.holeTransitionNumber}>{UI_TEXT.HOLE_TRANSITION_HOLE(currentHole + 2)}</ThemedText>
        </ThemedView>
      );
    }
    
    const currentPlayer = players[currentPlayerIndex];
    const rerollsRemaining = unlimitedRerolls ? Infinity : maxRerolls - currentPlayer.rerollsUsed;
    const canReroll = unlimitedRerolls || rerollsRemaining > 0;
    
    // Find the current roll option to display its description
    const displayedRoll = displayRoll || currentRoll;
    const currentRollOption = enabledStrings.find(s => s.name === displayedRoll);

    const handleRollAgain = () => {
      if (canReroll) {
        const newRoll = getRandomString(currentRoll);
        setCurrentRoll(newRoll);
        animateRoll(newRoll);
        
        // Update player's total rerolls used (only if not unlimited)
        if (!unlimitedRerolls) {
          const newPlayers = [...players];
          newPlayers[currentPlayerIndex].rerollsUsed += 1;
          setPlayers(newPlayers);
        }
      }
    };

    const handleContinue = async () => {
      // Record this throw for the current player
      const newPlayers = [...players];
      
      // Ensure the throwsPerHole array exists for this hole
      if (!newPlayers[currentPlayerIndex].throwsPerHole[currentHole]) {
        newPlayers[currentPlayerIndex].throwsPerHole[currentHole] = [];
      }
      newPlayers[currentPlayerIndex].throwsPerHole[currentHole].push({
        throwNumber: currentThrow,
        result: currentRoll
      });
      setPlayers(newPlayers);
      
      // Increment throw counter for this player
      setCurrentThrow(currentThrow + 1);
      
      // Track throw for ad display
      incrementThrow();
      
      // Debug logging for ad system
      console.log('🎯 Throw tracked! Ad Status:', { shouldShowAd, isAdReady });
      
      // Check if we should show a video ad
      if (shouldShowAd && isAdReady) {
        console.log('🎬 Showing video ad now!');
        await showAd();
        resetCounter();
      } else if (shouldShowAd && !isAdReady) {
        console.log('⚠️ Ad should show but not ready yet');
      }

      // Check if there are other players still playing
      const activePlayers = players.filter((_, idx) => !playersFinishedCurrentHole.has(idx));
      
      if (activePlayers.length === 1 && !playersFinishedCurrentHole.has(currentPlayerIndex)) {
        // Current player is the only one still playing - let them continue
        const newRoll = getRandomString();
        setCurrentRoll(newRoll);
        animateRoll(newRoll);
        return;
      }
      
      // Multiple players still active - show player selection for multi-player games
      if (numPlayers > 1) {
        setShowPlayerSelect(true);
      } else {
        // Single player - just continue
        const newRoll = getRandomString();
        setCurrentRoll(newRoll);
        animateRoll(newRoll);
      }
    };
    
    const handleFinishHole = async () => {
      // Save the final score for this hole for the current player
      const newPlayers = [...players];
      newPlayers[currentPlayerIndex].scores[currentHole] = currentRoll;
      
      // Ensure the throwsPerHole array exists for this hole
      if (!newPlayers[currentPlayerIndex].throwsPerHole[currentHole]) {
        newPlayers[currentPlayerIndex].throwsPerHole[currentHole] = [];
      }
      newPlayers[currentPlayerIndex].throwsPerHole[currentHole].push({
        throwNumber: currentThrow,
        result: currentRoll
      });
      setPlayers(newPlayers);
      
      // Track throw for ad display
      incrementThrow();
      
      // Debug logging for ad system
      console.log('🎯 Throw tracked (finish hole)! Ad Status:', { shouldShowAd, isAdReady });
      
      // Check if we should show a video ad
      if (shouldShowAd && isAdReady) {
        console.log('🎬 Showing video ad now!');
        await showAd();
        resetCounter();
      } else if (shouldShowAd && !isAdReady) {
        console.log('⚠️ Ad should show but not ready yet');
      }

      // Mark current player as finished with this hole
      const newFinishedPlayers = new Set(playersFinishedCurrentHole);
      newFinishedPlayers.add(currentPlayerIndex);
      setPlayersFinishedCurrentHole(newFinishedPlayers);

      // Debug: Log state
      const actualNumPlayers = newPlayers.length;
      console.log('Players finished:', newFinishedPlayers.size, 'out of', actualNumPlayers);
      console.log('Finished player indices:', Array.from(newFinishedPlayers));
      
      // Check if all players have completed this hole - use actual player count
      if (newFinishedPlayers.size === actualNumPlayers) {
        // All players finished this hole
        console.log('All players finished hole', currentHole + 1);
        if (currentHole < numHoles - 1) {
          // Show hole transition screen
          setShowHoleTransition(true);
          
          // After 3 seconds, show player selection for new hole (or start if single player)
          setTimeout(() => {
            setCurrentHole(currentHole + 1);
            setCurrentThrow(1); // Reset throw counter for new hole
            setPlayersFinishedCurrentHole(new Set()); // Reset finished players for new hole
            setShowHoleTransition(false);
            
            // For multi-player, show player selection to choose who goes first
            // For single player, just start
            if (numPlayers > 1) {
              setShowPlayerSelect(true);
            } else {
              setCurrentPlayerIndex(0);
              const newRoll = getRandomString();
              setCurrentRoll(newRoll);
              animateRoll(newRoll);
            }
          }, 3000);
        } else {
          // Game finished - clear saved state
          await clearGameState();
          setScreen('results');
        }
      } else {
        // Not all players finished - find next player who hasn't finished this hole
        console.log('Not all finished. Finding next unfinished player...');
        let nextPlayerIndex = (currentPlayerIndex + 1) % actualNumPlayers;
        let attempts = 0;
        while (newFinishedPlayers.has(nextPlayerIndex) && attempts < actualNumPlayers) {
          nextPlayerIndex = (nextPlayerIndex + 1) % actualNumPlayers;
          attempts++;
        }
        
        // Safety check: if we couldn't find an unfinished player, something is wrong
        if (attempts >= actualNumPlayers) {
          console.error('Could not find unfinished player! This should not happen.');
          // Fallback: show player selection modal
          setShowPlayerSelect(true);
          return;
        }
        
        console.log('Switching to player', nextPlayerIndex, 'who has not finished');
        setCurrentPlayerIndex(nextPlayerIndex);
        // Calculate throw number safely
        const nextPlayerThrows = newPlayers[nextPlayerIndex].throwsPerHole[currentHole]?.length || 0;
        setCurrentThrow(nextPlayerThrows + 1);
        const newRoll = getRandomString();
        setCurrentRoll(newRoll);
        animateRoll(newRoll);
      }
    };

    return (
      <>
        <ThemedView style={styles.container}>
          <ScrollView 
            style={styles.scrollContent} 
            contentContainerStyle={[
              styles.scrollContentContainer,
              { paddingTop: Math.max(20, insets.top) }
            ]}
          >
            <TouchableOpacity 
              style={[styles.settingsButton, { top: Math.max(4, insets.top) }]}
              onPress={() => router.push('/settings')}
            >
              <ThemedText style={styles.settingsButtonText}>···</ThemedText>
            </TouchableOpacity>
            
            <ThemedView style={styles.playerCard}>
              <ThemedText type="title" style={styles.playerName}>
                {currentPlayer.name}
              </ThemedText>
              <ThemedText style={styles.holeNumber}>
                Hole {currentHole + 1} of {numHoles} • Throw {currentThrow}
              </ThemedText>
            </ThemedView>

            {numPlayers > 1 && (
              <ThemedView style={styles.playerStatusContainer}>
                <ThemedText style={styles.playerStatusTitle}>Hole Status:</ThemedText>
                <View style={styles.playerStatusList}>
                  {players.map((player, index) => (
                    <View key={index} style={styles.playerStatusItem}>
                      <ThemedText style={[
                        styles.playerStatusName,
                        index === currentPlayerIndex && styles.playerStatusActive,
                        playersFinishedCurrentHole.has(index) && styles.playerStatusFinished
                      ]}>
                        {playersFinishedCurrentHole.has(index) ? '✓ ' : ''}
                        {player.name}
                        {index === currentPlayerIndex && !playersFinishedCurrentHole.has(index) ? ' (playing)' : ''}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </ThemedView>
            )}

            <ThemedView style={styles.rollContainer}>
              <ThemedView style={styles.rollResult}>
                {isAnimating ? (
                  <>
                    <View style={styles.slotMachineContainer}>
                      <Animated.View 
                        style={[
                          styles.slotMachineReel,
                          { 
                            transform: [{ translateY: Animated.multiply(scrollAnim, -1) }]
                          }
                        ]}
                      >
                        {slotMachineList.map((item, index) => (
                          <View key={index} style={styles.slotMachineItem}>
                            <Text 
                              style={styles.rollText}
                              numberOfLines={1}
                              ellipsizeMode="tail"
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
                            { width: `${animationProgress * 100}%` }
                          ]} 
                        />
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.slotMachineContainer}>
                      <Text 
                        style={styles.rollText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {displayedRoll}
                      </Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBackground} />
                    </View>
                  </>
                )}
              </ThemedView>
              
              {currentRollOption && (
                <Animated.Text style={[styles.rollDescription, { opacity: isAnimating ? 0 : descriptionOpacity }]}>
                  {currentRollOption.description}
                </Animated.Text>
              )}
            </ThemedView>
          </ScrollView>

          <View style={[
            styles.bottomButtonContainer,
            { paddingBottom: BANNER_AD_HEIGHT + Math.max(10, insets.bottom) }
          ]}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[
                  styles.gameButton, 
                  styles.acceptButton,
                  isAnimating && styles.disabledButton
                ]} 
                onPress={handleContinue}
                disabled={isAnimating}
              >
                <ThemedText style={styles.gameButtonText}>{UI_TEXT.GAME_BUTTON_NEXT_SHOT}</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.gameButton, 
                  styles.nextHoleButton,
                  isAnimating && styles.disabledButton
                ]} 
                onPress={handleFinishHole}
                disabled={isAnimating}
              >
                <ThemedText style={styles.gameButtonText}>{UI_TEXT.GAME_BUTTON_IN_BASKET}</ThemedText>
              </TouchableOpacity>

              {(maxRerolls > 0 || unlimitedRerolls) && (
                <TouchableOpacity 
                  style={[
                    styles.gameButton, 
                    styles.rollButton,
                    (!canReroll || isAnimating) && styles.disabledButton
                  ]} 
                  onPress={handleRollAgain}
                  disabled={!canReroll || isAnimating}
                >
                  <ThemedText style={styles.gameButtonText}>
                    {unlimitedRerolls 
                      ? UI_TEXT.GAME_BUTTON_ROLL_AGAIN 
                      : canReroll 
                        ? UI_TEXT.GAME_BUTTON_ROLL_AGAIN_COUNT(rerollsRemaining, maxRerolls) 
                        : UI_TEXT.GAME_BUTTON_NO_REROLLS}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity 
              style={styles.quitButton} 
              onPress={handleQuitGame}
            >
              <ThemedText style={styles.quitButtonText}>{UI_TEXT.GAME_BUTTON_QUIT}</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
        {renderModal()}
        <BannerAd />
      </>
    );
  }

  // RESULTS SCREEN
  if (screen === 'results') {
    const handlePlayAgain = async () => {
      await clearGameState();
      router.replace('/');
    };

    const handlePlayerTabChange = (index: number) => {
      setSelectedPlayerIndex(index);
      // Scroll to top when changing player - use setTimeout to ensure state update completes
      setTimeout(() => {
        statsScrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
      }, 0);
    };

    const selectedPlayer = players[selectedPlayerIndex];
    const throwsPerHole = selectedPlayer.throwsPerHole || [];
    const totalThrows = throwsPerHole.reduce((sum, holeThrows) => sum + (holeThrows?.length || 0), 0);

    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>{UI_TEXT.RESULTS_TITLE}</ThemedText>

          {/* Player Tabs - only show if more than one player */}
          {numPlayers > 1 && (
            <View style={styles.tabsWrapper}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.tabsContainer}
                contentContainerStyle={styles.tabsContentContainer}
              >
                {players.map((player, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.tab,
                      selectedPlayerIndex === index && styles.tabActive
                    ]}
                    onPress={() => handlePlayerTabChange(index)}
                  >
                    <ThemedText style={[
                      styles.tabText,
                      selectedPlayerIndex === index && styles.tabTextActive
                    ]}>
                      {player.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Player Statistics */}
          <ScrollView ref={statsScrollViewRef} style={styles.statsScrollView}>
            {totalThrows > 0 && (
              <ThemedView style={styles.summaryCard}>
                <ThemedView style={styles.summaryStatsRow}>
                  <ThemedView style={styles.summaryStatItem}>
                    <ThemedText style={styles.summaryStatLabel}>{UI_TEXT.RESULTS_TOTAL_THROWS}</ThemedText>
                    <ThemedText style={styles.summaryStatValue}>{totalThrows}</ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            )}

            {selectedPlayer.scores.map((score, holeIndex) => {
              const holeThrows = selectedPlayer.throwsPerHole?.[holeIndex] || [];
              
              return (
                <ThemedView key={holeIndex} style={styles.holeDetailCard}>
                  <ThemedText style={styles.holeDetailTitle}>
                    {UI_TEXT.RESULTS_HOLE(holeIndex + 1)}
                  </ThemedText>
                  
                  {holeThrows.length > 0 && (
                    <ThemedView style={styles.throwsList}>
                      {holeThrows.map((throwData, throwIndex) => (
                        <ThemedView key={throwIndex} style={styles.throwItem}>
                          <ThemedText style={styles.throwNumber}>
                            {throwIndex + 1}.
                          </ThemedText>
                          <ThemedText style={styles.throwResult}>
                            {throwData.result}
                          </ThemedText>
                        </ThemedView>
                      ))}
                    </ThemedView>
                  )}
                </ThemedView>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.continueButton} onPress={handlePlayAgain}>
            <ThemedText style={styles.continueButtonText}>{UI_TEXT.RESULTS_PLAY_AGAIN}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  return null;
}

