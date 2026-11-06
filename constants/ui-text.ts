/**
 * Centralized UI text strings for the Crazy Disc Golf app
 */

export const UI_TEXT = {
  // App title
  APP_TITLE: "Crazy Disc Golf",

  // Intro screen
  INTRO_CONTINUE_GAME: "Continue Saved Round",
  INTRO_START_NEW_GAME: "Start New Round",
  INTRO_LETS_PLAY: "Let's Play!",

  // Game setup screen
  SETUP_NUM_PLAYERS: "Players on Card",
  SETUP_NUM_HOLES: "Number of Holes",
  SETUP_REROLLS: "Rerolls Per Player",
  SETUP_UNLIMITED_REROLLS: "Unlimited rerolls",
  SETUP_CHALLENGE_PACK: "Challenge Pack",
  SETUP_CUSTOMIZE_MODIFIERS: "Customize Modifiers",
  SETUP_START_GAME: "Tee Off!",

  // Player names screen
  NAMES_TITLE: "Who's on the Card?",
  NAMES_SUBTITLE: "Enter player names in tee-off order",
  NAMES_PLAYER_LABEL: (num: number) => `Player ${num}`,
  NAMES_CONTINUE: "Start Round 🥏",

  // Game screen
  GAME_HOLE_OF: (current: number, total: number) =>
    `Hole ${current} of ${total}`,
  GAME_THROW: (num: number) => `Throw #${num}`,
  GAME_HOLE_STATUS: "Card Status",
  GAME_PLAYER_PLAYING: (name: string) => `${name} (throwing)`,
  GAME_REROLLS_REMAINING: (remaining: number, total: number) =>
    `Rerolls: ${remaining}/${total}`,
  GAME_BUTTON_NEXT_SHOT: "Next Throw →",
  GAME_BUTTON_IN_BASKET: "In the Basket!",
  GAME_BUTTON_ROLL_AGAIN: "🎲 Reroll Shot",
  GAME_BUTTON_ROLL_AGAIN_COUNT: (remaining: number, total: number) =>
    `🎲 Reroll (${remaining}/${total} left)`,
  GAME_BUTTON_NO_REROLLS: "No Rerolls Left",
  GAME_BUTTON_UNDO: "↩ Undo Last Throw",
  GAME_BUTTON_SCORECARD: "📋 Scorecard",
  GAME_BUTTON_QUIT: "End Round",
  GAME_QUIT_CONFIRM_TITLE: "End This Round?",
  GAME_QUIT_CONFIRM_MESSAGE:
    "Your current round progress will be cleared. Are you sure you want to quit?",
  GAME_QUIT_CONFIRM_CANCEL: "Keep Playing",
  GAME_QUIT_CONFIRM_QUIT: "End Round",

  // Player selection modal
  PLAYER_SELECT_WHO_FIRST: "Who has the box?",
  PLAYER_SELECT_WHO_NEXT: "Who's away / throwing next?",
  PLAYER_SELECT_TEE_OFF: "Select which player is teeing off next",
  PLAYER_SELECT_THROW_NEXT: "Pick the next player to roll their shot modifier",
  PLAYER_SELECT_THROWS: (count: number) =>
    `${count} throw${count !== 1 ? "s" : ""}`,

  // Hole transition
  HOLE_TRANSITION_COMPLETE: (holeNum: number) => `Hole ${holeNum} Complete!`,
  HOLE_TRANSITION_TIME_FOR: "Up Next",
  HOLE_TRANSITION_HOLE: (num: number) => `Hole ${num}`,
  HOLE_TRANSITION_NEXT_BUTTON: (num: number) => `Tee Off Hole ${num} →`,

  // Results screen
  RESULTS_TITLE: "Final Scorecard",
  RESULTS_LEADERBOARD: "Card Standings",
  RESULTS_TOTAL_THROWS: "Total Throws",
  RESULTS_AVERAGE: "Avg / Hole",
  RESULTS_BEST_HOLE: "Best Hole",
  RESULTS_REROLLS_USED: "Rerolls Used",
  RESULTS_HOLE: (num: number) => `Hole ${num}`,
  RESULTS_THROWS_COUNT: (count: number) =>
    `${count} throw${count !== 1 ? "s" : ""}`,
  RESULTS_PLAY_AGAIN: "New Round Setup",
  RESULTS_REMATCH: "🔄 Rematch (Same Card)",

  // Settings screen
  SETTINGS_TITLE: "Shot Modifiers",
  SETTINGS_BACK: "← Back",
  SETTINGS_SUBTITLE: "Customize the Challenge Pool",
  SETTINGS_DESCRIPTION:
    "Pick a preset pack or toggle individual shot modifiers. At least one modifier must stay active.",
  SETTINGS_PACKS_SECTION: "QUICK PRESET PACKS",
  SETTINGS_INFO: (enabled: number, total: number) =>
    `${enabled} of ${total} modifiers active in the pool`,
  SETTINGS_MIN_PLAYERS: (count: number) => `${count}+ players`,
  SETTINGS_LOADING: "Loading modifiers...",

  // Custom strings
  SETTINGS_DEFAULT_SECTION: "BUILT-IN MODIFIERS",
  SETTINGS_CUSTOM_SECTION: "YOUR CUSTOM MODIFIERS",
  SETTINGS_CUSTOM_ADD: "+ Add Custom Modifier",
  SETTINGS_CUSTOM_EDIT: "Edit",
  SETTINGS_CUSTOM_DELETE: "Delete",

  // Custom strings modal
  SETTINGS_MODAL_TITLE_ADD: "New Custom Modifier",
  SETTINGS_MODAL_TITLE_EDIT: "Edit Custom Modifier",
  SETTINGS_MODAL_NAME_LABEL: "Modifier Title",
  SETTINGS_MODAL_NAME_PLACEHOLDER: "e.g., Berg Only, Forehand Roller",
  SETTINGS_MODAL_DESC_LABEL: "Rule Description",
  SETTINGS_MODAL_DESC_PLACEHOLDER: "Explain what the player has to do on this throw...",
  SETTINGS_MODAL_MIN_PLAYERS_LABEL: "Minimum Players (optional)",
  SETTINGS_MODAL_SAVE: "Save Modifier",
  SETTINGS_MODAL_CANCEL: "Cancel",

  // Default fallback
  DEFAULT_RANDOM_STRING: "Your Choice!",

  // Credit
  CREDIT_TEXT: "Vibe coded by Thomas Aldrin",
  CREDIT_INSTAGRAM_URL: "https://www.instagram.com/aldrin_discgolf",
} as const;
