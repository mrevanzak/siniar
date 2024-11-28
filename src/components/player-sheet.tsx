/** eslint-disable max-lines-per-function */
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import {
  Backward10Seconds,
  Forward10Seconds,
  Next,
  Previous,
  Sound,
} from 'iconsax-react-native';
import { forwardRef } from 'react';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
  useProgress,
} from 'react-native-track-player';

import { formatDuration } from '@/lib';

import { PlayButton } from './play-button';
import { colors,Image, Modal, type ModalProps, Text, View } from './ui';
import { PressableScale } from './ui/pressable-scale';

type PlayerSheetProps = Omit<ModalProps, 'children'> & {};

export const PlayerSheet = forwardRef<BottomSheetModal, PlayerSheetProps>(
  // eslint-disable-next-line max-lines-per-function
  (props, ref) => {
    const activeTrack = useActiveTrack();
    const { duration, position } = useProgress();
    const { playing } = useIsPlaying();

    const playbackStyle = useAnimatedStyle(() => ({
      width: withTiming(playing ? `${(position / duration) * 100}%` : '0%', {
        duration: 1000,
      }),
    }));

    return (
      <Modal
        {...props}
        ref={ref}
        index={0}
        snapPoints={['100%']}
        backgroundComponent={(props) => <BlurView {...props} className="" />}
        style={{ paddingHorizontal: 20 }}
        headerClassName="mt-safe"
        hideCloseButton
        title="Now Playing"
      >
        <Image
          source={{ uri: activeTrack?.artwork }}
          className="aspect-square w-screen self-center rounded-lg"
          contentFit="contain"
        />
        <View className="mb-safe flex-1 justify-evenly">
          <View>
            <Text className="mt-2.5 text-center text-sm font-semibold">
              {activeTrack?.title}
            </Text>
            <Text className="text-center text-sm">{activeTrack?.artist}</Text>
          </View>

          <View>
            <View className="mb-2.5 flex-row justify-between">
              <Text className="text-xs font-semibold">
                {formatDuration(position)}
              </Text>
              <Text className="text-xs font-semibold">
                {formatDuration(duration)}
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
            <PressableScale onPress={() => TrackPlayer.seekBy(-10)}>
              <Backward10Seconds size={24} color={colors.gray} />
            </PressableScale>
            <Previous size={24} color={colors.gray} />
            <PlayButton size={60} />
            <Next size={24} color={colors.gray} />
            <PressableScale onPress={() => TrackPlayer.seekBy(+10)}>
              <Forward10Seconds size={24} color={colors.gray} />
            </PressableScale>
          </View>
        </View>
      </Modal>
    );
  },
);
