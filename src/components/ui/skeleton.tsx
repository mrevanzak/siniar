import type { MotiSkeletonProps } from 'moti/build/skeleton/types';
import { Skeleton as MotiSkeleton } from 'moti/skeleton';
import { useColorScheme } from 'nativewind';

export function Skeleton(props: Omit<MotiSkeletonProps, 'Gradient'>) {
  const { colorScheme } = useColorScheme();
  return <MotiSkeleton colorMode={colorScheme} {...props} />;
}

Skeleton.Group = MotiSkeleton.Group;
