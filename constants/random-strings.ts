export type ChallengeCategory =
  | "disc"
  | "angle"
  | "form"
  | "party"
  | "bonus"
  | "custom";

export interface CategoryMeta {
  id: ChallengeCategory;
  label: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export const CHALLENGE_CATEGORIES: Record<ChallengeCategory, CategoryMeta> = {
  disc: {
    id: "disc",
    label: "Disc Selection",
    emoji: "🥏",
    bgColor: "rgba(107, 194, 53, 0.26)",
    borderColor: "rgba(168, 230, 76, 0.68)",
    textColor: "#D9F99D",
  },
  angle: {
    id: "angle",
    label: "Shot Shape & Line",
    emoji: "📐",
    bgColor: "rgba(43, 140, 190, 0.28)",
    borderColor: "rgba(125, 211, 252, 0.68)",
    textColor: "#BAE6FD",
  },
  form: {
    id: "form",
    label: "Grip & Stance",
    emoji: "🎯",
    bgColor: "rgba(244, 127, 29, 0.28)",
    borderColor: "rgba(253, 186, 116, 0.68)",
    textColor: "#FED7AA",
  },
  party: {
    id: "party",
    label: "Card Chaos",
    emoji: "🔥",
    bgColor: "rgba(138, 63, 217, 0.30)",
    borderColor: "rgba(216, 180, 254, 0.68)",
    textColor: "#E9D5FF",
  },
  bonus: {
    id: "bonus",
    label: "Wildcard Bonus",
    emoji: "🍀",
    bgColor: "rgba(252, 174, 36, 0.28)",
    borderColor: "rgba(253, 224, 71, 0.68)",
    textColor: "#FEF08A",
  },
  custom: {
    id: "custom",
    label: "Custom Rule",
    emoji: "✨",
    bgColor: "rgba(78, 158, 31, 0.28)",
    borderColor: "rgba(168, 230, 76, 0.68)",
    textColor: "#DCFCE7",
  },
};

export interface RandomStringOption {
  id: string;
  name: string;
  description: string;
  category?: ChallengeCategory;
  minPlayers?: number; // Minimum number of players required for this option to be available
  isCustom?: boolean; // Flag to distinguish custom options from default ones
}

export const RANDOM_STRINGS: RandomStringOption[] = [
  // Disc Selection
  {
    id: "free-disc-choice",
    name: "Your Choice!",
    description: "Choose any disc and any shot shape from your bag.",
    category: "disc",
  },
  {
    id: "driver",
    name: "Driver Only",
    description: "Must throw a distance or fairway driver for this shot—even inside the circle!",
    category: "disc",
  },
  {
    id: "mid-range",
    name: "Mid-Range Only",
    description: "Must use a mid-range disc for this throw.",
    category: "disc",
  },
  {
    id: "putter",
    name: "Putter Only",
    description: "Must throw a putter (off the tee, fairway, or green).",
    category: "disc",
  },
  {
    id: "overstable-beef",
    name: "Most Overstable",
    description: "Throw the most beefy, overstable disc in your bag.",
    category: "disc",
  },
  {
    id: "understable-flip",
    name: "Most Understable",
    description: "Throw the flippiest, most understable disc in your bag.",
    category: "disc",
  },

  // Shot Shape & Line
  {
    id: "hyzer-line",
    name: "Pure Hyzer",
    description: "Release on a strict hyzer angle and let it finish on hyzer.",
    category: "angle",
  },
  {
    id: "anhyzer-flex",
    name: "Anhyzer / Turnover",
    description: "Release on an anhyzer angle—force a flex or hold the turnover line.",
    category: "angle",
  },
  {
    id: "roller",
    name: "Roller",
    description: "Throw must hit the ground early and roll (backhand or forehand roller).",
    category: "angle",
  },
  {
    id: "overhand-hammer",
    name: "Thumber / Tomahawk",
    description: "Must throw an overhand shot (Thumber or Tomahawk).",
    category: "angle",
  },
  {
    id: "spike-hyzer",
    name: "Spike Hyzer / Grenade",
    description: "Take the high vertical route over the top with a steep landing angle.",
    category: "angle",
  },
  {
    id: "low-ceiling-skip",
    name: "Low Ceiling Skip",
    description: "Keep the flight low under an imaginary ceiling and play for the ground skip.",
    category: "angle",
  },

  // Grip & Stance
  {
    id: "forehand-sidearm",
    name: "Forehand (Sidearm)",
    description: "Must throw a forehand / sidearm shot.",
    category: "form",
  },
  {
    id: "backhand-only",
    name: "Backhand Only",
    description: "Must throw a classic backhand shot.",
    category: "form",
  },
  {
    id: "standstill",
    name: "Standstill Only",
    description: "No run-up or X-step allowed—plant your feet and rip it from a standstill.",
    category: "form",
  },
  {
    id: "patent-pending",
    name: "Patent Pending",
    description: "Step out wide facing away from the target like you're deep in the rough.",
    category: "form",
  },
  {
    id: "turbo-putt",
    name: "Turbo Putt",
    description: "Hold the disc like a pizza tray above your shoulder and spin it forward!",
    category: "form",
  },
  {
    id: "flamingo-stance",
    name: "Flamingo Stance",
    description: "Balance on one leg during your entire release.",
    category: "form",
  },
  {
    id: "non-dominant-hand",
    name: "Non-Dominant Hand",
    description: "Must throw with your off-hand (lefty for righties, righty for lefties).",
    category: "form",
  },

  // Card Chaos (Multiplayer & Trick)
  {
    id: "opponents-choice",
    name: "Opponent's Choice",
    description: "Another player on the card picks which disc from your bag you must throw.",
    category: "party",
    minPlayers: 2,
  },
  {
    id: "bag-swap",
    name: "Bag Swap",
    description: "Borrow a disc from another player's bag for this throw!",
    category: "party",
    minPlayers: 2,
  },
  {
    id: "caddys-call",
    name: "Card's Call",
    description: "Your cardmates vote on whether you throw Backhand, Forehand, or Overhand.",
    category: "party",
    minPlayers: 2,
  },

  // Wildcard Bonuses
  {
    id: "mulligan",
    name: "Free Mulligan!",
    description: "Throw any shot you want—if you don't like it, take a free second throw!",
    category: "bonus",
  },
  {
    id: "best-of-two",
    name: "Player B (Best of 2)",
    description: "Player B always strips it! Throw two discs from this lie and play the best one.",
    category: "bonus",
  },
];

export interface ChallengePack {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  optionIds: string[];
}

export const CHALLENGE_PACKS: ChallengePack[] = [
  {
    id: "all",
    name: "All-Out Chaos",
    emoji: "🌪️",
    subtitle: "All 24 modifiers active",
    optionIds: RANDOM_STRINGS.map((s) => s.id),
  },
  {
    id: "casual",
    name: "Casual League",
    emoji: "🥏",
    subtitle: "Fun shot variety without total disaster",
    optionIds: [
      "free-disc-choice",
      "driver",
      "mid-range",
      "putter",
      "overstable-beef",
      "understable-flip",
      "hyzer-line",
      "anhyzer-flex",
      "forehand-sidearm",
      "backhand-only",
      "standstill",
      "opponents-choice",
      "mulligan",
      "best-of-two",
    ],
  },
  {
    id: "clinic",
    name: "Lines & Form",
    emoji: "📐",
    subtitle: "Great for solo practice & shot shaping",
    optionIds: [
      "driver",
      "mid-range",
      "putter",
      "overstable-beef",
      "understable-flip",
      "hyzer-line",
      "anhyzer-flex",
      "spike-hyzer",
      "low-ceiling-skip",
      "forehand-sidearm",
      "backhand-only",
      "standstill",
      "patent-pending",
    ],
  },
  {
    id: "party",
    name: "Party & Trick Shots",
    emoji: "🎉",
    subtitle: "Rollers, Turbos, Off-Hand & Bag Swaps",
    optionIds: [
      "free-disc-choice",
      "putter",
      "roller",
      "overhand-hammer",
      "patent-pending",
      "turbo-putt",
      "flamingo-stance",
      "non-dominant-hand",
      "opponents-choice",
      "bag-swap",
      "caddys-call",
      "mulligan",
      "best-of-two",
    ],
  },
];
