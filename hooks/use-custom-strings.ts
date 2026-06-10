import { RandomStringOption } from '@/constants/random-strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const STORAGE_KEY = '@crazy_discgolf_custom_strings';

export function useCustomStrings() {
  const [customStrings, setCustomStrings] = useState<RandomStringOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomStrings();
  }, []);

  const loadCustomStrings = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCustomStrings(parsed);
      }
    } catch (error) {
      console.error('Failed to load custom strings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveToStorage = async (strings: RandomStringOption[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(strings));
      setCustomStrings(strings);
    } catch (error) {
      console.error('Failed to save custom strings:', error);
    }
  };

  const addCustomString = async (name: string, description: string, minPlayers?: number) => {
    const newString: RandomStringOption = {
      id: `custom-${Date.now()}`,
      name,
      description,
      minPlayers,
      isCustom: true,
    };
    
    const updated = [...customStrings, newString];
    await saveToStorage(updated);
    return newString;
  };

  const updateCustomString = async (id: string, name: string, description: string, minPlayers?: number) => {
    const updated = customStrings.map(str => 
      str.id === id 
        ? { ...str, name, description, minPlayers }
        : str
    );
    await saveToStorage(updated);
  };

  const deleteCustomString = async (id: string) => {
    const updated = customStrings.filter(str => str.id !== id);
    await saveToStorage(updated);
  };

  const refreshCustomStrings = () => {
    loadCustomStrings();
  };

  return {
    customStrings,
    loading,
    addCustomString,
    updateCustomString,
    deleteCustomString,
    refreshCustomStrings,
  };
}
