import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Podcast } from '@/api/podcasts/schema';

import { zustandStorage } from '../storage';
import { type ActionState, createSelectors } from '../utils';

type PlayerState = {
  active: Podcast | null;
};

const _usePlayerStore = create<PlayerState & ActionState<PlayerState>>()(
  persist(
    (set) => ({
      active: null,
      setActive: (active) => set({ active }),
    }),
    {
      name: 'player',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

export const usePlayerStore = createSelectors(_usePlayerStore);
