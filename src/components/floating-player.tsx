import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';

import { getFeaturedPodcastQuery } from '@/api/podcasts/use-featured-podcast';

import { PlayButton } from './play-button';
import { PlayerSheet } from './player-sheet';
import { Image, Text, TouchableOpacity, useModal,View } from './ui';

// eslint-disable-next-line max-lines-per-function
export function FloatingPlayer() {
  const { colorScheme } = useColorScheme();

  const activeTrack = useActiveTrack();

  const featuredPodcastQuery = useQuery({
    ...getFeaturedPodcastQuery,
    enabled: !activeTrack,
  });
  const data = featuredPodcastQuery.data?.collection[0];

  useEffect(() => {
    if (!data) return;

    TrackPlayer.add([
      {
        url: data.enclosure_url,
        title: data.title,
        artist: 'React Native Radio',
        artwork: data.image_url,
      },
    ]);
  }, [data]);

  const modal = useModal();

  return (
    <TouchableOpacity onPress={() => modal.present()}>
      <BlurView
        className="absolute inset-x-3 bottom-28 h-14 flex-row items-center justify-between overflow-hidden rounded-lg px-3"
        experimentalBlurMethod="dimezisBlurView"
        tint="dark"
        intensity={colorScheme === 'dark' ? 100 : 15}
      >
        <View className="flex-row items-center gap-4">
          <Image
            source={{ uri: activeTrack?.artwork }}
            className="size-10 rounded-lg"
            contentFit="contain"
          />
          <Text className="text-sm">{activeTrack?.title}</Text>
        </View>

        <PlayButton />
      </BlurView>

      <PlayerSheet ref={modal.ref} />
    </TouchableOpacity>
  );
}
