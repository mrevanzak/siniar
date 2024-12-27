import { toast } from '@baronha/ting';
import { Ionicons } from '@expo/vector-icons';
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
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import Animated, { useSharedValue } from 'react-native-reanimated';
import TrackPlayer, {
  useActiveTrack,
  useProgress,
} from 'react-native-track-player';
import { match } from 'ts-pattern';

import type { Podcast } from '@/api/podcasts/schema';
import { PlayButton } from '@/components/play-button';
import {
  ActivityIndicator,
  colors,
  Image,
  ModalHeader,
  PressableScale,
  SheetScreen,
  Text,
  View,
} from '@/components/ui';
import { formatDuration } from '@/lib';
import { useDownload } from '@/lib/hooks/use-download';
import { useDownloadsStore } from '@/lib/stores/downloads';

// eslint-disable-next-line max-lines-per-function
export default function PlayerModal() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const color = isDark ? colors.gray : colors.white;

  const params = useLocalSearchParams<{ podcast: string }>();
  const data = JSON.parse(params.podcast) as Podcast;

  const activeTrack = useActiveTrack();
  const progress = useProgress();
  const isSelected =
    new URL(data.enclosure_url).toString() === activeTrack?.url;
  const duration = isSelected ? progress.duration : (data.duration ?? 0);
  const position = isSelected ? progress.position : 0;

  const isInteracting = useSharedValue(false);
  const progressShared = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  useEffect(() => {
    if (!isInteracting.value && isSelected)
      progressShared.value = duration > 0 ? position / duration : 0;
  }, [duration, isInteracting, isSelected, position, progressShared]);

  const download = useDownload();
  const toggleDownload = useDownloadsStore.use.toggleDownload();
  const isDownloaded = useDownloadsStore.use.isDownloaded()(data);
  function onDownload() {
    if (!data) return;

    if (isDownloaded) {
      toggleDownload(data);
      toast({
        title: 'Deleted',
      });

      if (data.enclosure_url.includes('file://')) router.back();
      return;
    }

    toast({
      preset: 'spinner',
      title: 'Downloading...',
    });
    download.mutate(
      {
        filename: data.title ?? 'podcast',
        url: data.enclosure_url,
      },
      {
        onSuccess: (downloadedUrl) => {
          toggleDownload({
            ...data,
            enclosure_url: downloadedUrl,
          });
        },
      },
    );
  }

  return (
    <SheetScreen
      customBackground={
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          tint="systemChromeMaterialDark"
          style={StyleSheet.absoluteFill}
        />
      }
      // @ts-expect-error just type error because of cssInterop
      className="py-safe px-4"
      onClose={() => router.back()}
      opacityOnGestureMove
    >
      <ModalHeader
        title={isSelected ? 'Now Playing' : 'Podcast'}
        titleStyle={{ color }}
        className="my-2"
        startContent={
          <PressableScale
            className="absolute left-0 top-2.5 rounded-full border border-white p-2 dark:border-dark-gray"
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onPress={() => router.back()}
          >
            <ArrowLeft2 size={24} color={color} />
          </PressableScale>
        }
        endContent={
          <PressableScale
            className="absolute right-3 top-5 size-[24px]"
            onPress={onDownload}
          >
            {match(isDownloaded)
              .with(true, () => (
                <Ionicons name="checkmark" size={24} color={color} />
              ))
              .when(
                () => download.isPending,
                () => <ActivityIndicator size="small" color={color} />,
              )
              .with(false, () => (
                <Ionicons name="download" size={24} color={color} />
              ))
              .exhaustive()}
          </PressableScale>
        }
      />
      <Image
        source={data?.image_url}
        sharedTransitionTag={data?.image_url}
        className="aspect-square w-full self-center rounded-lg"
        contentFit="contain"
      />
      <View className="flex-1 justify-evenly">
        <View>
          <Text
            className="mt-2.5 text-center text-sm font-semibold"
            style={{ color }}
          >
            {data.title}
          </Text>
          <Text className="text-center text-sm" style={{ color }}>
            React Native Radio
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
            disable={!isSelected}
            progress={progressShared}
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
          <PlayButton size={60} iconProps={{ color }} selectedItem={data} />
          <Next size={24} color={color} />
          <PressableScale onPress={() => TrackPlayer.seekBy(+10)}>
            <Forward10Seconds size={24} color={color} />
          </PressableScale>
        </View>
      </View>
    </SheetScreen>
  );
}
