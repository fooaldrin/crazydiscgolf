import { RANDOM_STRINGS } from '@/constants/random-strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { useCustomStrings } from './use-custom-strings';

const STORAGE_KEY = '@crazy_discgolf_enabled_strings';

export function useEnabledStrings() {
  const { customStrings, loading: customLoading, refreshCustomStrings } = useCustomStrings();
  const [enabledStringIds, setEnabledStringIds] = useState<string[]>(
    RANDOM_STRINGS.map(s => s.id)
  );
  const [loading, setLoading] = useState(true);

  // Merge default and custom strings
  const allStrings = [...RANDOM_STRINGS, ...customStrings];

  useEffect(() => {
    loadSettings();
  }, [customStrings]); // Reload when custom strings change

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure at least one string is enabled
        if (parsed.length > 0) {
          setEnabledStringIds(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newEnabledIds: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEnabledIds));
      setEnabledStringIds(newEnabledIds);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // Get the enabled string objects
  const enabledStrings = allStrings.filter(s => enabledStringIds.includes(s.id));

  const refreshAll = useCallback(async () => {
    refreshCustomStrings();
    await loadSettings();
  }, [refreshCustomStrings]);

  return {
    enabledStrings,
    enabledStringIds,
    allStrings,
    loading: loading || customLoading,
    saveSettings,
    refreshSettings: refreshAll,
  };
}
