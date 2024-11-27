import { useAudioPlayer } from 'expo-audio';
import { BlurView } from 'expo-blur';
import { PauseCircle, PlayCircle } from 'iconsax-react-native';
import { useState } from 'react';

import { useFeaturedPodcast } from '@/api/podcasts/use-featured-podcast';

import { colors,Image, Text, View } from './ui';
import { PressableScale } from './ui/pressable-scale';

export function FloatingPlayer() {
  const featuredPodcastQuery = useFeaturedPodcast();

  const data = featuredPodcastQuery.data?.collection[0];
  const player = useAudioPlayer(data?.enclosure_url);
  const [isPlaying, setIsPlaying] = useState(player.playing);

  function onPlay() {
    if (player.playing) {
      player.pause();
      setIsPlaying(false);
      return;
    }

    player.play();
    setIsPlaying(true);
  }

  return (
    <BlurView
      className="absolute inset-x-3 bottom-28 h-14 flex-row items-center justify-between overflow-hidden rounded-lg px-3"
      experimentalBlurMethod="dimezisBlurView"
    >
      <View className="flex-row items-center gap-4">
        <Image
          source={{ uri: data?.image_url }}
          className="size-10 rounded-lg"
          contentFit="contain"
        />
        <Text className="text-sm">{data?.title}</Text>
      </View>

      <PressableScale onPress={onPlay}>
        {isPlaying ? (
          <PauseCircle size="32" color={colors.gray} variant="Bold" />
        ) : (
          <PlayCircle size="32" color={colors.gray} variant="Bold" />
        )}
      </PressableScale>
    </BlurView>
  );
}
