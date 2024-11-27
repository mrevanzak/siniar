import { BlurView } from 'expo-blur';
import { PauseCircle, PlayCircle } from 'iconsax-react-native';
import { useState } from 'react';

import { useFeaturedPodcast } from '@/api/podcasts/use-featured-podcast';

import { colors,Image, Text, View } from './ui';
import { PressableScale } from './ui/pressable-scale';

export function FloatingPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const featuredPodcastQuery = useFeaturedPodcast();
  const data = featuredPodcastQuery.data?.collection[0];

  return (
    <BlurView
      className="absolute inset-x-3 bottom-28 h-14 flex-row items-center justify-between overflow-hidden rounded-lg"
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

      <PressableScale onPress={() => setIsPlaying((prev) => !prev)}>
        {isPlaying ? (
          <PauseCircle size="32" color={colors.gray} variant="Bold" />
        ) : (
          <PlayCircle size="32" color={colors.gray} variant="Bold" />
        )}
      </PressableScale>
    </BlurView>
  );
}
