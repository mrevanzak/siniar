import { useInfiniteQuery } from '@tanstack/react-query';

import { client } from '../common';
import { podcastsSchema } from './schema';

export function usePodcasts(search: string) {
  return useInfiniteQuery({
    queryKey: ['podcasts', { search }],
    queryFn: async ({ pageParam }) => {
      const response = await client.get('episodes', {
        params: {
          status: 'published',
          limit: 10,
          sort: 'latest',
          search,
          offset: pageParam,
        },
      });

      return podcastsSchema.parse(response.data);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      (lastPage.pages.current - 1) * lastPage.pages.limit,
  });
}
