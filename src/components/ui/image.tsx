import { Image as NImage,type ImageProps } from 'expo-image';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import Animated, { type AnimatedProps } from 'react-native-reanimated';

export type ImgProps = AnimatedProps<ImageProps> & {
  className?: string;
};

cssInterop(NImage, { className: 'style' });
const AnimatedImage = Animated.createAnimatedComponent(NImage);

export const Image = ({
  style,
  className,
  placeholder = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
  ...props
}: ImgProps) => {
  return (
    <AnimatedImage
      className={className}
      placeholder={placeholder}
      transition={1000}
      style={style}
      {...props}
    />
  );
};

export const preloadImages = (sources: string[]) => {
  NImage.prefetch(sources);
};
