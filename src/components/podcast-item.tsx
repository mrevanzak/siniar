import { PlayCircle } from 'iconsax-react-native';

import type { Podcast } from '@/api/podcasts/schema';

import {
  colors,
  Image,
  PressableScale,
  Skeleton,
  Text,
  TouchableOpacity,
  View,
} from './ui';

type Props =
  | {
      item: Podcast;
      skeleton?: never;
    }
  | {
      item?: never;
      skeleton: boolean;
    };

export function PodcastItem({ item, skeleton = false }: Props) {
  return (
    <Skeleton.Group show={skeleton}>
      <TouchableOpacity className="flex-row items-center gap-4 py-2">
        <Skeleton>
          <Image source={item?.image_url} className="size-16 rounded-lg" />
        </Skeleton>

        <View className="flex-1">
          <Skeleton radius="square">
            <Text className="text-sm font-semibold">{item?.title}</Text>
          </Skeleton>
          <Skeleton radius="square">
            <Text className="text-xs opacity-70">
              React Native Radio •{' '}
              {item?.type === 'full'
                ? `E${item?.number}`
                : item?.type.toUpperCase()}
            </Text>
          </Skeleton>
        </View>

        {!skeleton && (
          <PressableScale>
            <PlayCircle size="32" color={colors.gray} />
          </PressableScale>
        )}
      </TouchableOpacity>
    </Skeleton.Group>
  );
}
