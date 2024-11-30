import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft2,
  Backward10Seconds,
  Forward10Seconds,
  Next,
  Previous,
  Sound,
} from 'iconsax-react-native';
import { useColorScheme } from 'nativewind';
import { useEffect, useMemo } from 'react';
import { Slider } from 'react-native-awesome-slider';
import Animated, { useSharedValue } from 'react-native-reanimated';
import TrackPlayer, {
  useActiveTrack,
  useProgress,
} from 'react-native-track-player';

import { podcastSchema } from '@/api/podcasts/schema';
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

  const params = useLocalSearchParams<{ podcast: string }>();
  const data = params?.podcast
    ? podcastSchema.parse(JSON.parse(params.podcast))
    : null;

  const activeTrack = useActiveTrack();
  const { duration, position } = useProgress();
  const isSelected = data ? data.enclosure_url === activeTrack?.url : true;

  const computedData = useMemo(() => {
    if (isSelected) {
      return {
        image: activeTrack?.artwork,
        url: activeTrack?.url,
        title: activeTrack?.title,
        position,
        duration,
      };
    }

    return {
      image: data?.image_url,
      url: data?.enclosure_url,
      title: data?.title,
      position: 0,
      duration: data?.duration ?? 0,
    };
  }, [
    activeTrack?.artwork,
    activeTrack?.title,
    activeTrack?.url,
    data?.duration,
    data?.enclosure_url,
    data?.image_url,
    data?.title,
    duration,
    isSelected,
    position,
  ]);

  const isInteracting = useSharedValue(false);
  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  useEffect(() => {
    if (!isInteracting.value && isSelected)
      progress.value = duration > 0 ? position / duration : 0;
  }, [duration, isInteracting, isSelected, position, progress]);

  return (
    <BlurView
      className="py-safe flex-1 px-4"
      experimentalBlurMethod="dimezisBlurView"
      tint="systemChromeMaterialDark"
    >
      <ModalHeader
        title="Now Playing"
        titleStyle={{ color }}
        className="my-2"
        startContent={
          <PressableScale
            className="absolute left-0 top-2.5 rounded-full border border-white p-2 dark:border-dark-gray"
            onPress={() => router.back()}
          >
            <ArrowLeft2 size={24} color={color} />
          </PressableScale>
        }
      />
      <Image
        source={computedData.image}
        sharedTransitionTag={computedData.image}
        className="aspect-square w-full self-center rounded-lg"
        contentFit="contain"
      />
      <View className="flex-1 justify-evenly">
        <View>
          <Text
            className="mt-2.5 text-center text-sm font-semibold"
            style={{ color }}
          >
            {computedData.title}
          </Text>
          <Text className="text-center text-sm" style={{ color }}>
            React Native Radio
          </Text>
        </View>

        <View className="gap-6">
          <View className="flex-row justify-between">
            <Text className="text-xs font-semibold" style={{ color }}>
              {formatDuration(computedData.position)}
            </Text>
            <Text className="text-xs font-semibold" style={{ color }}>
              {formatDuration(computedData.duration)}
            </Text>
          </View>
          <Slider
            disable={!isSelected}
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
