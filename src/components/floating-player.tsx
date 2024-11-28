import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';

import { getFeaturedPodcastQuery } from '@/api/podcasts/use-featured-podcast';

import { PlayButton } from './play-button';
import { PlayerSheet } from './player-sheet';
import { Image, Text, TouchableOpacity, useModal,View } from './ui';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

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

    TrackPlayer.setQueue([
      {
        url: data.enclosure_url,
        title: data.title,
        artist: 'React Native Radio',
        artwork: data.image_url,
      },
    ]);
  }, [data]);

  const modal = useModal();

  if (!activeTrack) return null;

  return (
    <AnimatedTouchableOpacity
      entering={FadeInDown}
      exiting={FadeInUp}
      onPress={() => modal.present()}
    >
      <BlurView
        className="absolute inset-x-3 bottom-28 h-14 justify-center overflow-hidden rounded-lg px-3"
        experimentalBlurMethod="dimezisBlurView"
        tint="dark"
        intensity={colorScheme === 'dark' ? 100 : 15}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <Image
              source={{ uri: activeTrack.artwork }}
              className="size-10 rounded-lg"
              contentFit="contain"
            />
            <Text
              className="flex-1 text-sm"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {activeTrack.title}
            </Text>
            <PlayButton className="" />
          </View>
        </View>
      </BlurView>

      <PlayerSheet ref={modal.ref} />
    </AnimatedTouchableOpacity>
  );
}
