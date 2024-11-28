import { z } from 'zod';

const podcastSchema = z.object({
  updated_at: z.string(),
  type: z.union([z.literal('full'), z.literal('trailer'), z.literal('bonus')]),
  token: z.string(),
  title: z.string(),
  status: z.string(),
  slug: z.string(),
  season: z.object({
    href: z.string(),
    number: z.number(),
    next_episode_number: z.number(),
  }),
  scheduled_for: z.null(),
  published_at: z.string(),
  number: z.number().nullable(),
  is_hidden: z.boolean(),
  image_url: z.string(),
  image_path: z.string(),
  id: z.string(),
  href: z.string(),
  guid: z.string(),
  feeds: z.null(),
  enclosure_url: z.string(),
  duration: z.number(),
  description: z.string(),
  days_since_release: z.number(),
  audio_status: z.string(),
  analytics: z.null(),
});
export type Podcast = z.infer<typeof podcastSchema>;

export const podcastsSchema = z.object({
  href: z.string(),
  pages: z.object({
    total: z.number(),
    previous: z
      .object({
        href: z.string().url(),
      })
      .nullable(),
    next: z
      .object({
        href: z.string().url(),
      })
      .nullable(),
    limit: z.number(),
    current: z.number(),
  }),
  dashboard_link: z.string(),
  create: z.null(),
  count: z.number(),
  collection: z.array(podcastSchema),
  average_duration: z.number(),
});
