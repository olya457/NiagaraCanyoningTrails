import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {GalleryEntry} from '../types/app';
import {storageKeys} from './keys';

type GalleryContextValue = {
  entries: GalleryEntry[];
  hydrated: boolean;
  addEntry: (entry: Omit<GalleryEntry, 'id'>) => Promise<void>;
  removeEntry: (entryId: string) => Promise<void>;
};

const GalleryContext = createContext<GalleryContextValue | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export function GalleryProvider({children}: Props): React.JSX.Element {
  const [entries, setEntries] = useState<GalleryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadEntries() {
      try {
        const raw = await AsyncStorage.getItem(storageKeys.galleryEntries);
        const parsed = raw ? JSON.parse(raw) : [];
        if (mounted && Array.isArray(parsed)) {
          setEntries(
            parsed.filter(
              entry =>
                entry &&
                typeof entry.id === 'string' &&
                typeof entry.name === 'string' &&
                typeof entry.location === 'string' &&
                typeof entry.date === 'string' &&
                typeof entry.imageTrailId === 'string' &&
                (entry.imageUri === undefined ||
                  typeof entry.imageUri === 'string'),
            ),
          );
        }
      } finally {
        if (mounted) {
          setHydrated(true);
        }
      }
    }

    loadEntries();

    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(async (nextEntries: GalleryEntry[]) => {
    setEntries(nextEntries);
    await AsyncStorage.setItem(
      storageKeys.galleryEntries,
      JSON.stringify(nextEntries),
    );
  }, []);

  const addEntry = useCallback(
    async (entry: Omit<GalleryEntry, 'id'>) => {
      const nextEntry = {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      };
      await persist([nextEntry, ...entries]);
    },
    [entries, persist],
  );

  const removeEntry = useCallback(
    async (entryId: string) => {
      await persist(entries.filter(entry => entry.id !== entryId));
    },
    [entries, persist],
  );

  const value = useMemo(
    () => ({entries, hydrated, addEntry, removeEntry}),
    [addEntry, entries, hydrated, removeEntry],
  );

  return (
    <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
  );
}

export function useGallery(): GalleryContextValue {
  const value = useContext(GalleryContext);

  if (!value) {
    throw new Error('useGallery must be used within GalleryProvider');
  }

  return value;
}
