/** eslint-disable max-lines-per-function */
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { type AudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { BlurView } from 'expo-blur';
import {
  Backward10Seconds,
  Forward10Seconds,
  Next,
  PauseCircle,
  PlayCircle,
  Previous,
  Sound,
} from 'iconsax-react-native';
import { forwardRef, useState } from 'react';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import type { Podcast } from '@/api/podcasts/schema';
import { formatDuration } from '@/lib';

import { colors,Image, Modal, type ModalProps, Text, View } from './ui';
import { PressableScale } from './ui/pressable-scale';

type PlayerSheetProps = Omit<ModalProps, 'children'> & {
  data: Podcast;
  player: AudioPlayer;
};

export const PlayerSheet = forwardRef<BottomSheetModal, PlayerSheetProps>(
  // eslint-disable-next-line max-lines-per-function
  ({ data, player: _player, ...rest }, ref) => {
    const player = useAudioPlayerStatus(_player);
    const [isPlaying, setIsPlaying] = useState(player.playing);

    const playbackStyle = useAnimatedStyle(() => ({
      width: withTiming(
        player.currentTime > 0 && player.duration > 0
          ? `${(player.currentTime / player.duration) * 100}%`
          : '0%',
        {
          duration: 1000,
        },
      ),
    }));

    function onPlay() {
      if (player.playing) {
        _player.pause();
        setIsPlaying(false);
        return;
      }

      _player.play();
      setIsPlaying(true);
    }

    async function onSeekTo(second: number) {
      await _player.seekTo(new Date(player.currentTime).getSeconds() + second);
    }

    return (
      <Modal
        {...rest}
        ref={ref}
        index={0}
        snapPoints={['100%']}
        backgroundComponent={(props) => <BlurView {...props} className="" />}
        style={{ paddingHorizontal: 20 }}
        hideCloseButton
        title="Now Playing"
      >
        <Image
          source={{ uri: data?.image_url }}
          className="aspect-square w-screen self-center rounded-lg"
          contentFit="contain"
        />
        <View className="mb-safe flex-1 justify-evenly">
          <View>
            <Text className="mt-2.5 text-center text-sm font-semibold">
              {data?.title}
            </Text>
            <Text className="text-center text-sm">React Native Radio</Text>
          </View>

          <View>
            <View className="mb-2.5 flex-row justify-between">
              <Text className="text-xs font-semibold">
                {formatDuration(player.currentTime)}
              </Text>
              <Text className="text-xs font-semibold">
                {formatDuration(player.duration)}
              </Text>
            </View>
            <View>
              <View className="flex-row">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Sound key={index} size={48} color={colors.gray} />
                ))}
              </View>
              <Animated.View
                className="absolute inset-x-0 flex-row overflow-hidden"
                style={playbackStyle}
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <Sound key={index} size={48} color={colors['primary-red']} />
                ))}
              </Animated.View>
            </View>
          </View>

          <View className="flex-row items-center justify-center gap-5">
            <PressableScale onPress={async () => await onSeekTo(-10)}>
              <Backward10Seconds size={24} color={colors.gray} />
            </PressableScale>
            <Previous size={24} color={colors.gray} />
            <PressableScale onPress={onPlay}>
              {isPlaying ? (
                <PauseCircle size="60" color={colors.gray} variant="Bold" />
              ) : (
                <PlayCircle size="60" color={colors.gray} variant="Bold" />
              )}
            </PressableScale>
            <Next size={24} color={colors.gray} />
            <PressableScale onPress={async () => await onSeekTo(+10)}>
              <Forward10Seconds size={24} color={colors.gray} />
            </PressableScale>
          </View>
        </View>
      </Modal>
    );
  },
);
