import type {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import {
  type NavigationRoute,
  type ParamListBase,
  useTheme,
} from '@react-navigation/native';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from 'react';
import { Dimensions, type LayoutChangeEvent, View } from 'react-native';
import Animated, {
  clamp,
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { match,P } from 'ts-pattern';

import { capitalize } from '@/lib';

import { PressableScale } from './pressable-scale';

const MARGIN = 16;
const SCREEN_WIDTH = Dimensions.get('window').width - MARGIN;

type TabBarItemProps = {
  route: NavigationRoute<ParamListBase, string>;
  index: number;
  options: BottomTabNavigationOptions;
  state: BottomTabBarProps['state'];
  navigation: BottomTabBarProps['navigation'];
  activeItemWidth: SharedValue<number>;
  setPositionX: Dispatch<SetStateAction<number[]>>;
};

// eslint-disable-next-line max-lines-per-function
function TabBarItem({
  options,
  route,
  index,
  state,
  navigation,
  activeItemWidth,
  setPositionX,
}: TabBarItemProps) {
  const animated = useSharedValue(false);

  const { colors } = useTheme();

  const Label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
        ? options.title
        : capitalize(route.name);

  const isFocused = state.index === index;
  const activeColor = options.tabBarActiveTintColor ?? colors.primary;
  const inactiveColor = options.tabBarInactiveTintColor ?? colors.background;

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  const Icon = options.tabBarIcon;

  const onInnerLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (isFocused) {
        activeItemWidth.set(e.nativeEvent.layout.width + MARGIN * 2);
      }
    },
    [activeItemWidth, isFocused],
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const x = e.nativeEvent.layout.x;
      setPositionX((prev) => {
        const next = [...prev];
        next[index] = x;
        return next;
      });
    },
    [index, setPositionX],
  );

  return (
    <PressableScale
      key={route.key}
      className="h-16 flex-1 justify-center"
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onLayout={onLayout}
    >
      <Animated.View
        layout={LinearTransition.springify()
          .damping(80)
          .stiffness(200)
          .withCallback(() => {
            animated.value = true;
          })}
        className="justify-center self-center"
        onLayout={onInnerLayout}
      >
        <Animated.View className="flex-row items-center justify-center gap-2">
          {Icon && (
            <Icon
              focused={isFocused}
              size={24}
              color={isFocused ? activeColor : inactiveColor}
            />
          )}
          {isFocused ? (
            <Animated.Text
              entering={FadeInRight.springify().damping(80).stiffness(200)}
              exiting={FadeOutLeft.springify().damping(80).stiffness(200)}
              style={{ color: isFocused ? activeColor : inactiveColor }}
            >
              {match(Label)
                .with(P.string, (label) => label)
                .otherwise(() => undefined)}
            </Animated.Text>
          ) : null}
        </Animated.View>
      </Animated.View>
    </PressableScale>
  );
}

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const activeItemWidth = useSharedValue(SCREEN_WIDTH / state.routes.length);
  const [positionX, setPositionX] = useState(
    Array(state.routes.length).fill(0),
  );

  const backgroundStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(
            clamp(
              positionX[state.index] - (state.index * MARGIN) / 3,
              0,
              SCREEN_WIDTH - activeItemWidth.value,
            ),
            {
              duration: 200,
            },
          ),
        },
      ],
      width: withTiming(activeItemWidth.value),
    };
  });

  return (
    <View
      className="mb-safe h-20 flex-row items-center justify-center"
      style={{ marginHorizontal: MARGIN }}
    >
      <Animated.View
        className="absolute inset-0 my-5 rounded-full bg-primary-red"
        style={[backgroundStyle]}
      />

      {state.routes.map((route, index) => (
        <TabBarItem
          key={route.key}
          options={descriptors[route.key].options}
          route={route}
          index={index}
          state={state}
          navigation={navigation}
          activeItemWidth={activeItemWidth}
          setPositionX={setPositionX}
        />
      ))}
    </View>
  );
}
