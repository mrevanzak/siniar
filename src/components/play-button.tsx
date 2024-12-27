import { type IconProps, PauseCircle, PlayCircle } from 'iconsax-react-native';
import { useColorScheme } from 'nativewind';
import type { TouchableOpacityProps } from 'react-native';
import TrackPlayer, {
  State,
  usePlaybackState,
} from 'react-native-track-player';
import { match,P } from 'ts-pattern';

import type { Podcast } from '@/api/podcasts/schema';
import { usePlayerStore } from '@/lib/stores/player';

import { ActivityIndicator, colors,PressableScale } from './ui';

type Props = {
  size?: number;
  isPlaying?: boolean;
  selectedItem?: Podcast;
  iconProps?: IconProps;
} & TouchableOpacityProps;

// eslint-disable-next-line max-lines-per-function
export function PlayButton({
  size = 32,
  selectedItem,
  iconProps,
  ...rest
}: Props) {
  const { colorScheme } = useColorScheme();

  const buttonColor =
    colorScheme === 'dark' ? colors.gray : colors['dark-gray'];

  const { state } = usePlaybackState();
  const activeTrack = usePlayerStore((state) => state.active);
  const setActiveTrack = usePlayerStore((state) => state.setActive);

  const isPlaying = rest.isPlaying ?? state === State.Playing;
  const isLoading = state === State.Buffering || state === State.Loading;
  const isDiff = activeTrack?.enclosure_url !== selectedItem?.enclosure_url;

  async function onPlay() {
    if (isPlaying) return TrackPlayer.pause();
    if (isDiff && selectedItem) {
      TrackPlayer.setQueue([
        {
          url: selectedItem.enclosure_url,
          title: selectedItem.title,
          artist: 'React Native Radio',
          artwork: selectedItem.image_url,
        },
      ]);
      setActiveTrack(selectedItem);
    }
    if ((await TrackPlayer.getQueue()).length === 0 && activeTrack) {
      TrackPlayer.setQueue([
        {
          url: activeTrack.enclosure_url,
          title: activeTrack.title,
          artist: 'React Native Radio',
          artwork: activeTrack.image_url,
        },
      ]);
    }
    TrackPlayer.play();
  }

  return (
    <PressableScale {...rest} onPress={onPlay}>
      {match([isPlaying, isLoading])
        .with([false, P.boolean], () => (
          <PlayCircle
            size={size}
            color={buttonColor}
            variant="Bold"
            {...iconProps}
          />
        ))
        .with([true, true], () => (
          <ActivityIndicator size={size} color={buttonColor} />
        ))
        .with([true, false], () => (
          <PauseCircle
            size={size}
            color={buttonColor}
            variant="Bold"
            {...iconProps}
          />
        ))
        .exhaustive()}
    </PressableScale>
  );
}
