import { PauseCircle, PlayCircle } from 'iconsax-react-native';
import { useColorScheme } from 'nativewind';
import type { TouchableOpacityProps } from 'react-native';
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
} from 'react-native-track-player';
import { match,P } from 'ts-pattern';

import type { Podcast } from '@/api/podcasts/schema';

import { ActivityIndicator, colors,PressableScale } from './ui';

type Props = {
  size?: number;
  isPlaying?: boolean;
  selectedItem?: Podcast;
} & TouchableOpacityProps;

export function PlayButton({ size = 32, selectedItem, ...rest }: Props) {
  const { colorScheme } = useColorScheme();

  const buttonColor =
    colorScheme === 'dark' ? colors.gray : colors['dark-gray'];

  const { state } = usePlaybackState();
  const activeTrack = useActiveTrack();
  const isPlaying = rest.isPlaying ?? state === State.Playing;
  const isLoading = state === State.Buffering || state === State.Loading;

  function onPlay() {
    const isDiff = activeTrack?.url !== selectedItem?.enclosure_url;
    if (isPlaying) return TrackPlayer.pause();

    if (isDiff && selectedItem)
      TrackPlayer.setQueue([
        {
          url: selectedItem.enclosure_url,
          title: selectedItem.title,
          artist: 'React Native Radio',
          artwork: selectedItem.image_url,
        },
      ]);
    TrackPlayer.play();
  }

  return (
    <PressableScale {...rest} onPress={onPlay}>
      {match([isPlaying, isLoading])
        .with([false, P.boolean], () => (
          <PlayCircle size={size} color={buttonColor} variant="Bold" />
        ))
        .with([true, true], () => (
          <ActivityIndicator size={size} color={buttonColor} />
        ))
        .with([true, false], () => (
          <PauseCircle size={size} color={buttonColor} variant="Bold" />
        ))
        .exhaustive()}
    </PressableScale>
  );
}
