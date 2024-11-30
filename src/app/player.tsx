import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Backward10Seconds,
  Forward10Seconds,
  Next,
  Previous,
  Sound,
} from 'iconsax-react-native';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { Slider } from 'react-native-awesome-slider';
import Animated, { useSharedValue } from 'react-native-reanimated';
import TrackPlayer, {
  useActiveTrack,
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

  const isInteracting = useSharedValue(false);
  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  useEffect(() => {
    if (!isInteracting.value)
      progress.value = duration > 0 ? position / duration : 0;
  }, [position, duration]);

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

        <View className="gap-6">
          <View className="flex-row justify-between">
            <Text className="text-xs font-semibold" style={{ color }}>
              {formatDuration(position)}
            </Text>
            <Text className="text-xs font-semibold" style={{ color }}>
              {formatDuration(duration)}
            </Text>
          </View>
          <Slider
            progress={progress}
            minimumValue={min}
            maximumValue={max}
            sliderHeight={48}
            renderThumb={() => null}
            renderBubble={() => null}
            style={{
              alignItems: 'flex-start',
            }}
            renderContainer={({ style, seekStyle }) => (
              <View style={[style, { backgroundColor: 'transparent' }]}>
                <View className="flex-row">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <Sound key={index} size={48} color={color} />
                  ))}
                </View>
                <Animated.View
                  style={[
                    seekStyle,
                    {
                      flexDirection: 'row',
                      overflow: 'hidden',
                      height: 'auto',
                      backgroundColor: 'transparent',
                    },
                  ]}
                >
                  {Array.from({ length: 10 }).map((_, index) => (
                    <Sound
                      key={index}
                      size={48}
                      color={colors['primary-red']}
                    />
                  ))}
                </Animated.View>
              </View>
            )}
            onSlidingStart={() => {
              isInteracting.value = true;
            }}
            onValueChange={async (value) => {
              await TrackPlayer.seekTo(value * duration);
              await Haptics.selectionAsync();
            }}
            onSlidingComplete={async (value) => {
              // if the user is not sliding, we should not update the position
              if (!isInteracting.value) return;

              isInteracting.value = false;

              await TrackPlayer.seekTo(value * duration);
            }}
          />
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
