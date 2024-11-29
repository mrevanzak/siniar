import { Heart } from 'iconsax-react-native';
import { useColorScheme } from 'nativewind';
import type { TouchableOpacityProps } from 'react-native';

import type { Podcast } from '@/api/podcasts/schema';
import { useFavoritesStore } from '@/lib/stores/favorites';

import { colors,PressableScale } from './ui';

type Props = {
  size?: number;
  selectedItem: Podcast;
} & TouchableOpacityProps;

export function FavoriteButton({ size = 32, selectedItem, ...rest }: Props) {
  const { colorScheme } = useColorScheme();

  const buttonColor =
    colorScheme === 'dark' ? colors.gray : colors['dark-gray'];

  const isFavorite = useFavoritesStore.use.isFavorite()(selectedItem);
  const toggleFavorite = useFavoritesStore.use.toggleFavorite();

  return (
    <PressableScale {...rest} onPress={() => toggleFavorite(selectedItem)}>
      <Heart
        size={size}
        color={buttonColor}
        variant={isFavorite ? 'Bold' : 'Linear'}
      />
    </PressableScale>
  );
}
