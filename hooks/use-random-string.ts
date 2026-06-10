import { useEnabledStrings } from './use-enabled-strings';

export function useRandomString(numPlayers: number) {
  const { enabledStrings } = useEnabledStrings();

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
      return enabledStrings[0]?.name || 'Free disc choice';
    }
    
    const randomOption = availableStrings[Math.floor(Math.random() * availableStrings.length)];
    return randomOption.name;
  };

  return { getRandomString };
}
