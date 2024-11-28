import { queryOptions } from '@tanstack/react-query';

import { client } from '../common';
import { podcastsSchema } from './schema';

export const getFeaturedPodcastQuery = queryOptions({
  queryKey: ['featured'],
  queryFn: async () => {
    const response = await client.get('episodes', {
      params: { status: 'published', limit: 1, type: 'trailer' },
    });

    return podcastsSchema.parse(response.data);
  },
});
