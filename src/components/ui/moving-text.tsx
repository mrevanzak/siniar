import { useEffect } from 'react';
import type { TextProps } from 'react-native';
import Animated, {
  type AnimatedProps,
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Text } from './text';

export type MovingTextProps = {
  animationThreshold: number;
  text: string;
} & AnimatedProps<TextProps>;

const AnimatedText = Animated.createAnimatedComponent(Text);

export const MovingText = ({
  animationThreshold,
  style,
  text,
  ...rest
}: MovingTextProps) => {
  const translateX = useSharedValue(0);
  const shouldAnimate = text.length >= animationThreshold;

  const textWidth = text.length * 3;

  useEffect(() => {
    if (!shouldAnimate) return;

    translateX.value = withDelay(
      1000,
      withRepeat(
        withTiming(-textWidth, {
          duration: 5000,
          easing: Easing.linear,
        }),
        -1,
        true,
      ),
    );

    return () => {
      cancelAnimation(translateX);
      translateX.value = 0;
    };
  }, [shouldAnimate, textWidth, translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <AnimatedText
      {...rest}
      numberOfLines={1}
      style={[
        style,
        animatedStyle,
        shouldAnimate && {
          width: 9999, // preventing the ellipsis from appearing
          paddingLeft: 16, // avoid the initial character being barely visible
        },
      ]}
    >
      {text}
    </AnimatedText>
  );
};
