import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import {
  Backward10Seconds,
  Forward10Seconds,
  Next,
  Previous,
  Sound,
} from 'iconsax-react-native';
import { useColorScheme } from 'nativewind';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
  useProgress,
} from 'react-native-track-player';

import { PlayButton } from '@/components/play-button';
import {
  colors,
  Image,
  ModalHeader,
  PressableScale,
  Text,
  View,
} from '@/components/ui';
import { formatDuration } from '@/lib';

// eslint-disable-next-line max-lines-per-function
export default function PlayerModal() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const color = isDark ? colors.gray : colors.white;

  const activeTrack = useActiveTrack();
  const { duration, position } = useProgress();
  const { playing } = useIsPlaying();

  const playbackStyle = useAnimatedStyle(() => ({
    width: withTiming(playing ? `${(position / duration) * 100}%` : '0%', {
      duration: 1000,
    }),
  }));

  return (
    <BlurView
      className="py-safe flex-1 px-4"
      experimentalBlurMethod="dimezisBlurView"
      tint="systemChromeMaterialDark"
    >
      <ModalHeader
        title="Now Playing"
        titleStyle={{ color }}
        dismiss={() => router.back()}
        hideCloseButton
      />
      <Image
        source={{ uri: activeTrack?.artwork }}
        sharedTransitionTag={activeTrack?.artwork}
        className="aspect-square w-full self-center rounded-lg"
        contentFit="contain"
      />
      <View className="flex-1 justify-evenly">
        <View>
          <Text
            className="mt-2.5 text-center text-sm font-semibold"
            style={{ color }}
          >
            {activeTrack?.title}
          </Text>
          <Text className="text-center text-sm" style={{ color }}>
            {activeTrack?.artist}
          </Text>
        </View>

        <View>
          <View className="mb-2.5 flex-row justify-between">
            <Text className="text-xs font-semibold" style={{ color }}>
              {formatDuration(position)}
            </Text>
            <Text className="text-xs font-semibold" style={{ color }}>
              {formatDuration(duration)}
            </Text>
          </View>
          <View className="overflow-hidden">
            <View className="flex-row">
              {Array.from({ length: 10 }).map((_, index) => (
                <Sound key={index} size={48} color={color} />
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
            <Backward10Seconds size={24} color={color} />
          </PressableScale>
          <Previous size={24} color={color} />
          <PlayButton size={60} iconProps={{ color }} />
          <Next size={24} color={color} />
          <PressableScale onPress={() => TrackPlayer.seekBy(+10)}>
            <Forward10Seconds size={24} color={color} />
          </PressableScale>
        </View>
      </View>
    </BlurView>
  );
}
