import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {storageKeys} from './keys';

type SavedTrailsContextValue = {
  savedIds: string[];
  hydrated: boolean;
  isSaved: (trailId: string) => boolean;
  toggleSaved: (trailId: string) => Promise<void>;
  removeSaved: (trailId: string) => Promise<void>;
};

const SavedTrailsContext = createContext<SavedTrailsContextValue | undefined>(
  undefined,
);

type Props = {
  children: React.ReactNode;
};

export function SavedTrailsProvider({children}: Props): React.JSX.Element {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSavedIds() {
      try {
        const raw = await AsyncStorage.getItem(storageKeys.savedTrailIds);
        const parsed = raw ? JSON.parse(raw) : [];
        if (mounted && Array.isArray(parsed)) {
          setSavedIds(parsed.filter(id => typeof id === 'string'));
        }
      } finally {
        if (mounted) {
          setHydrated(true);
        }
      }
    }

    loadSavedIds();

    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(async (nextIds: string[]) => {
    setSavedIds(nextIds);
    await AsyncStorage.setItem(storageKeys.savedTrailIds, JSON.stringify(nextIds));
  }, []);

  const isSaved = useCallback(
    (trailId: string) => savedIds.includes(trailId),
    [savedIds],
  );

  const toggleSaved = useCallback(
    async (trailId: string) => {
      const nextIds = savedIds.includes(trailId)
        ? savedIds.filter(id => id !== trailId)
        : [...savedIds, trailId];
      await persist(nextIds);
    },
    [persist, savedIds],
  );

  const removeSaved = useCallback(
    async (trailId: string) => {
      await persist(savedIds.filter(id => id !== trailId));
    },
    [persist, savedIds],
  );

  const value = useMemo(
    () => ({
      savedIds,
      hydrated,
      isSaved,
      toggleSaved,
      removeSaved,
    }),
    [hydrated, isSaved, removeSaved, savedIds, toggleSaved],
  );

  return (
    <SavedTrailsContext.Provider value={value}>
      {children}
    </SavedTrailsContext.Provider>
  );
}

export function useSavedTrails(): SavedTrailsContextValue {
  const value = useContext(SavedTrailsContext);

  if (!value) {
    throw new Error('useSavedTrails must be used within SavedTrailsProvider');
  }

  return value;
}
