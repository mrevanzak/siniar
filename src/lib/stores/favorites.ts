import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Podcast } from '@/api/podcasts/schema';

import { zustandStorage } from '../storage';
import { createSelectors } from '../utils';

type FavoritesState = {
  favorites: Podcast[];
  isFavorite: (podcast: Podcast) => boolean;
};
type FavoritesAction = {
  toggleFavorite: (podcast: Podcast) => void;
};

const _useFavoritesStore = create<FavoritesState & FavoritesAction>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (podcast) => {
        const index = get().favorites.findIndex((p) => p.id === podcast.id);
        if (index === -1) {
          set((state) => ({ favorites: [...state.favorites, podcast] }));
          return;
        }

        set((state) => ({
          favorites: state.favorites.filter((p) => p.id !== podcast.id),
        }));
      },
      isFavorite: (podcast) => get().favorites.some((p) => p.id === podcast.id),
    }),
    {
      name: 'favorites',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

export const useFavoritesStore = createSelectors(_useFavoritesStore);
