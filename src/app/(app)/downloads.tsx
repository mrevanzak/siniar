import { useCallback } from 'react';
import type { ListRenderItem } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import type { Podcast } from '@/api/podcasts/schema';
import { PodcastItem } from '@/components/podcast-item';
import { Text, View } from '@/components/ui';
import { useDownloadsStore } from '@/lib/stores/downloads';

export default function Download() {
  const downloads = useDownloadsStore.use.downloads();

  const renderItem: ListRenderItem<Podcast> = useCallback(
    ({ item }) => <PodcastItem key={item.id} item={item} />,
    [],
  );

  return (
    <View className="flex-1 px-4">
      <Animated.FlatList
        data={downloads}
        keyExtractor={(item) => item.id}
        className="mt-4"
        itemLayoutAnimation={LinearTransition}
        ListEmptyComponent={
          <Text className="text-center text-sm opacity-70">
            No download yet {'\n'} Start downloading your favorite podcasts
          </Text>
        }
        renderItem={renderItem}
      />
    </View>
  );
}
