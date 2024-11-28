import { PauseCircle, PlayCircle } from 'iconsax-react-native';
import { useColorScheme } from 'nativewind';
import type { TouchableOpacityProps } from 'react-native';
import TrackPlayer, {
  State,
  usePlaybackState,
} from 'react-native-track-player';
import { match,P } from 'ts-pattern';

import { ActivityIndicator, colors,PressableScale } from './ui';

type Props = {
  size?: number;
  isPlaying?: boolean;
} & TouchableOpacityProps;

export function PlayButton({ size = 32, ...rest }: Props) {
  const { colorScheme } = useColorScheme();

  const buttonColor =
    colorScheme === 'dark' ? colors.gray : colors['dark-gray'];

  const { state } = usePlaybackState();
  const isPlaying = rest.isPlaying ?? state === State.Playing;
  const isLoading = state === State.Buffering || state === State.Loading;

  return (
    <PressableScale
      {...rest}
      onPress={() => (isPlaying ? TrackPlayer.pause() : TrackPlayer.play())}
    >
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
