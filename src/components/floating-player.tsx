import { useAudioPlayer } from 'expo-audio';
import { BlurView } from 'expo-blur';
import { PauseCircle, PlayCircle } from 'iconsax-react-native';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';

import { useFeaturedPodcast } from '@/api/podcasts/use-featured-podcast';

import { PlayerSheet } from './player-sheet';
import { colors, Image, Text, TouchableOpacity, useModal,View } from './ui';
import { PressableScale } from './ui/pressable-scale';

export function FloatingPlayer() {
  const { colorScheme } = useColorScheme();
  const featuredPodcastQuery = useFeaturedPodcast();

  const data = featuredPodcastQuery.data?.collection[0];
  const player = useAudioPlayer(data?.enclosure_url);
  const [isPlaying, setIsPlaying] = useState(player.playing);

  const modal = useModal();

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
    <TouchableOpacity onPress={() => modal.present()}>
      <BlurView
        className="absolute inset-x-3 bottom-28 h-14 flex-row items-center justify-between overflow-hidden rounded-lg px-3"
        experimentalBlurMethod="dimezisBlurView"
        tint="dark"
        intensity={colorScheme === 'dark' ? 100 : 15}
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
            <PauseCircle
              size="32"
              color={colorScheme === 'dark' ? colors.gray : colors['dark-gray']}
              variant="Bold"
            />
          ) : (
            <PlayCircle
              size="32"
              color={colorScheme === 'dark' ? colors.gray : colors['dark-gray']}
              variant="Bold"
            />
          )}
        </PressableScale>
      </BlurView>

      {data && <PlayerSheet ref={modal.ref} data={data} player={player} />}
    </TouchableOpacity>
  );
}
