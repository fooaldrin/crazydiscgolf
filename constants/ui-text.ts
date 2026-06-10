/**
 * Centralized UI text strings for the Crazy Disc Golf app
 * Update these values to change text throughout the app
 */

export const UI_TEXT = {
  // App title
  APP_TITLE: 'Crazy Disc Golf',

  // Intro screen
  INTRO_CONTINUE_GAME: 'Continue Game',
  INTRO_START_NEW_GAME: 'Start New Game',
  INTRO_LETS_PLAY: "Let's Play!",

  // Game setup screen
  SETUP_NUM_PLAYERS: 'Number of Players',
  SETUP_NUM_HOLES: 'Number of Holes',
  SETUP_REROLLS: 'Rerolls Per Player',
  SETUP_UNLIMITED_REROLLS: 'Unlimited rerolls',
  SETUP_START_GAME: 'Start Game!',

  // Player names screen
  NAMES_TITLE: 'Enter Player Names',
  NAMES_PLAYER_LABEL: (num: number) => `Player ${num}`,
  NAMES_CONTINUE: 'Continue',

  // Game screen
  GAME_HOLE_OF: (current: number, total: number) => `Hole ${current} of ${total}`,
  GAME_THROW: (num: number) => `Throw ${num}`,
  GAME_HOLE_STATUS: 'Hole Status:',
  GAME_PLAYER_PLAYING: (name: string) => `${name} (playing)`,
  GAME_REROLLS_REMAINING: (remaining: number, total: number) => 
    `Rerolls: ${remaining}/${total}`,
  GAME_BUTTON_NEXT_SHOT: 'Next Shot',
  GAME_BUTTON_IN_BASKET: 'In Basket!',
  GAME_BUTTON_ROLL_AGAIN: 'Roll Again',
  GAME_BUTTON_ROLL_AGAIN_COUNT: (remaining: number, total: number) => 
    `Roll Again (${remaining}/${total})`,
  GAME_BUTTON_NO_REROLLS: 'No Rerolls Left',
  GAME_BUTTON_QUIT: 'Quit Game',
  GAME_QUIT_CONFIRM_TITLE: 'Quit Game?',
  GAME_QUIT_CONFIRM_MESSAGE: 'Are you sure you want to quit?',
  GAME_QUIT_CONFIRM_CANCEL: 'Cancel',
  GAME_QUIT_CONFIRM_QUIT: 'Quit',

  // Player selection modal
  PLAYER_SELECT_WHO_FIRST: 'Who throws first?',
  PLAYER_SELECT_WHO_NEXT: 'Who throws next?',
  PLAYER_SELECT_TEE_OFF: 'Select which player should tee off on this hole',
  PLAYER_SELECT_THROW_NEXT: 'Select which player should throw next',
  PLAYER_SELECT_THROWS: (count: number) => `${count} throw${count !== 1 ? 's' : ''}`,

  // Hole transition
  HOLE_TRANSITION_TIME_FOR: 'Time for',
  HOLE_TRANSITION_HOLE: (num: number) => `Hole ${num}`,

  // Results screen
  RESULTS_TITLE: 'Game Results',
  RESULTS_TOTAL_THROWS: 'Total Throws',
  RESULTS_AVERAGE: 'Average',
  RESULTS_REROLLS_USED: 'Rerolls Used',
  RESULTS_HOLE: (num: number) => `Hole ${num}`,
  RESULTS_THROWS_COUNT: (count: number) => `${count} throw${count !== 1 ? 's' : ''}`,
  RESULTS_PLAY_AGAIN: 'Play Again',

  // Settings screen
  SETTINGS_TITLE: 'Settings',
  SETTINGS_BACK: '← Back',
  SETTINGS_SUBTITLE: 'Select modifiers to use',
  SETTINGS_DESCRIPTION: 'Choose which options can appear during gameplay. At least one must be selected.',
  SETTINGS_INFO: (enabled: number, total: number) => 
    `${enabled} of ${total} options enabled`,
  SETTINGS_MIN_PLAYERS: (count: number) => `${count}+ players`,
  SETTINGS_LOADING: 'Loading...',
  
  // Custom strings
  SETTINGS_DEFAULT_SECTION: 'DEFAULT OPTIONS',
  SETTINGS_CUSTOM_SECTION: 'CUSTOM OPTIONS',
  SETTINGS_CUSTOM_ADD: '+ Add Custom Option',
  SETTINGS_CUSTOM_EDIT: 'Edit',
  SETTINGS_CUSTOM_DELETE: 'Delete',
  
  // Custom strings modal
  SETTINGS_MODAL_TITLE_ADD: 'Add Custom Option',
  SETTINGS_MODAL_TITLE_EDIT: 'Edit Custom Option',
  SETTINGS_MODAL_NAME_LABEL: 'Name',
  SETTINGS_MODAL_NAME_PLACEHOLDER: 'e.g., Rollers Only',
  SETTINGS_MODAL_DESC_LABEL: 'Description',
  SETTINGS_MODAL_DESC_PLACEHOLDER: 'Describe the modifier...',
  SETTINGS_MODAL_MIN_PLAYERS_LABEL: 'Minimum Players (optional)',
  SETTINGS_MODAL_SAVE: 'Save',
  SETTINGS_MODAL_CANCEL: 'Cancel',

  // Default fallback
  DEFAULT_RANDOM_STRING: 'Free disc choice',
} as const;
