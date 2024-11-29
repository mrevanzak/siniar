import React from 'react';
import type { TouchableOpacityProps } from 'react-native';
import { useActiveTrack, useIsPlaying } from 'react-native-track-player';

import type { Podcast } from '@/api/podcasts/schema';

import { FavoriteButton } from './favorite-button';
import { PlayButton } from './play-button';
import { Image, Skeleton, Text, TouchableOpacity, View } from './ui';

type Props =
  | {
      item: Podcast;
      skeleton?: never;
    }
  | {
      item?: never;
      skeleton: boolean;
    };

export function PodcastItem({
  item,
  skeleton = false,
  ...rest
}: Props & TouchableOpacityProps) {
  const activeTrack = useActiveTrack();
  const { playing } = useIsPlaying();
  const isPlaying = activeTrack?.url === item?.enclosure_url && playing;

  return (
    <Skeleton.Group show={skeleton}>
      <TouchableOpacity className="flex-row items-center gap-4 py-2" {...rest}>
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

        {!skeleton && item && (
          <React.Fragment>
            <FavoriteButton selectedItem={item} />
            <PlayButton
              isPlaying={isPlaying}
              selectedItem={item}
              iconProps={{ variant: 'Linear' }}
            />
          </React.Fragment>
        )}
      </TouchableOpacity>
    </Skeleton.Group>
  );
}
