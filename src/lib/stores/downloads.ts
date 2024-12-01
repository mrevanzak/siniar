import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Podcast } from '@/api/podcasts/schema';

import { zustandStorage } from '../storage';
import { createSelectors } from '../utils';

type DownloadsState = {
  downloads: Podcast[];
  isDownloaded: (podcast: Podcast) => boolean;
};
type DownloadsAction = {
  toggleDownload: (podcast: Podcast) => void;
};

const _useDownloadsStore = create<DownloadsState & DownloadsAction>()(
  persist(
    (set, get) => ({
      downloads: [],
      toggleDownload: (podcast) => {
        const index = get().downloads.findIndex((p) => p.id === podcast.id);
        if (index === -1) {
          set((state) => ({ downloads: [...state.downloads, podcast] }));
          return;
        }

        set((state) => ({
          downloads: state.downloads.filter((p) => p.id !== podcast.id),
        }));
      },
      isDownloaded: (podcast) =>
        get().downloads.some((p) => p.id === podcast.id),
    }),
    {
      name: 'downloads',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

export const useDownloadsStore = createSelectors(_useDownloadsStore);
