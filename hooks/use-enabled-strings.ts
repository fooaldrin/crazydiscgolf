import { CHALLENGE_PACKS, RANDOM_STRINGS } from "@/constants/random-strings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCustomStrings } from "./use-custom-strings";

const STORAGE_KEY = "@crazy_discgolf_enabled_strings_v2";

export function useEnabledStrings() {
  const {
    customStrings,
    loading: customLoading,
    refreshCustomStrings,
  } = useCustomStrings();
  const [enabledStringIds, setEnabledStringIds] = useState<string[]>(
    RANDOM_STRINGS.map((s) => s.id),
  );
  const [loading, setLoading] = useState(true);

  // Merge default and custom strings
  const allStrings = useMemo(
    () => [...RANDOM_STRINGS, ...customStrings],
    [customStrings],
  );

  const loadSettings = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEnabledStringIds(parsed);
        }
      } else {
        // Default: enable all built-in + custom strings
        setEnabledStringIds([
          ...RANDOM_STRINGS.map((s) => s.id),
          ...customStrings.map((c) => c.id),
        ]);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  }, [customStrings]);

  useEffect(() => {
    if (!customLoading) {
      loadSettings();
    }
  }, [customLoading, loadSettings]);

  const saveSettings = useCallback(async (newEnabledIds: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEnabledIds));
      setEnabledStringIds(newEnabledIds);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, []);

  const applyPack = useCallback(
    async (packId: string) => {
      const pack = CHALLENGE_PACKS.find((p) => p.id === packId);
      if (!pack) return;
      // Preserve any enabled custom strings when switching preset packs
      const enabledCustomIds = customStrings
        .filter((c) => enabledStringIds.includes(c.id))
        .map((c) => c.id);
      const nextIds = Array.from(
        new Set([...pack.optionIds, ...enabledCustomIds]),
      );
      await saveSettings(nextIds);
    },
    [customStrings, enabledStringIds, saveSettings],
  );

  // Determine which preset pack matches current built-in selection (if any)
  const activePackId = useMemo(() => {
    const enabledBuiltInSet = new Set(
      enabledStringIds.filter((id) =>
        RANDOM_STRINGS.some((s) => s.id === id),
      ),
    );
    for (const pack of CHALLENGE_PACKS) {
      if (
        pack.optionIds.length === enabledBuiltInSet.size &&
        pack.optionIds.every((id) => enabledBuiltInSet.has(id))
      ) {
        return pack.id;
      }
    }
    return "custom";
  }, [enabledStringIds]);

  // Get the enabled string objects
  const enabledStrings = useMemo(
    () => allStrings.filter((s) => enabledStringIds.includes(s.id)),
    [allStrings, enabledStringIds],
  );

  const refreshAll = useCallback(async () => {
    refreshCustomStrings();
    await loadSettings();
  }, [refreshCustomStrings, loadSettings]);

  return {
    enabledStrings,
    enabledStringIds,
    allStrings,
    activePackId,
    applyPack,
    loading: loading || customLoading,
    saveSettings,
    refreshSettings: refreshAll,
  };
}
