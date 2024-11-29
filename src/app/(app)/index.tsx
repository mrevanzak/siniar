import { FlashList } from '@shopify/flash-list';
import { NotificationBing, SearchNormal } from 'iconsax-react-native';
import { useMemo } from 'react';
import { ActivityIndicator, TextInput } from 'react-native';
import { useDebounceValue } from 'usehooks-ts';

import { usePodcasts } from '@/api/podcasts/use-podcasts';
import { PodcastItem } from '@/components/podcast-item';
import { colors,Image, SafeAreaView, Text, View } from '@/components/ui';
import { PressableScale } from '@/components/ui/pressable-scale';
import { useFavoritesStore } from '@/lib/stores/favorites';

// eslint-disable-next-line max-lines-per-function
export default function Home() {
  const [search, setSearch] = useDebounceValue('', 500);

  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = usePodcasts(search);
  const computedData = useMemo(
    () => data?.pages.flatMap((page) => page.collection),
    [data],
  );

  const favorites = useFavoritesStore.use.favorites()

  return (
    <SafeAreaView className="flex-1 gap-5 px-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Image
            source="https://api.dicebear.com/9.x/lorelei/svg"
            className="size-12 rounded-full bg-gray"
          />

          <View>
            <Text className="text-xs opacity-70">Hello</Text>
            <Text className="text-sm font-bold">Rev</Text>
          </View>
        </View>

        <PressableScale className="rounded-full border border-dark-gray p-2">
          <NotificationBing size={24} color={colors.gray} />
        </PressableScale>
      </View>

      <Text className="text-xl font-bold">Explore New Podcasts</Text>

      <View className="flex-row items-center justify-between rounded-full px-6 py-4 dark:bg-neutral-800">
        <TextInput
          onChangeText={setSearch}
          placeholder="Search your favorite podcast..."
          placeholderTextColor={colors.charcoal[600]}
          className="flex-1 dark:text-white"
        />
        <SearchNormal size={20} color={colors.charcoal[600]} />
      </View>

      <View className="flex-1 gap-3">
        <Text className="mt-4 font-bold">Podcasts</Text>
        <FlashList
          // little hax, source: https://github.com/Shopify/flash-list/issues/854
          data={computedData?.slice(0)}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          extraData={favorites}
          refreshing={isFetching}
          onRefresh={refetch}
          estimatedItemSize={96}
          ListEmptyComponent={
            isLoading ? (
              <View>
                {Array.from({ length: 4 }, (_, index) => (
                  <PodcastItem key={index} skeleton />
                ))}
              </View>
            ) : (
              <Text className="text-center text-sm opacity-70">
                No podcasts found
              </Text>
            )
          }
          renderItem={({ item }) => <PodcastItem key={item.id} item={item} />}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="small" color={colors['primary-red']} />
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}
