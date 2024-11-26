import type {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import {
  type NavigationRoute,
  type ParamListBase,
  useTheme,
} from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, type LayoutChangeEvent, View } from 'react-native';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { match, P } from 'ts-pattern';

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
  setActiveItemWidth: (width: number) => void;
};

// eslint-disable-next-line max-lines-per-function
function TabBarItem({
  options,
  route,
  index,
  state,
  navigation,
  setActiveItemWidth,
}: TabBarItemProps) {
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

  /** TODO!: need to change how we get the width of the active item */
  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (isFocused) {
        setActiveItemWidth(e.nativeEvent.layout.width);
      }
    },
    [isFocused, setActiveItemWidth],
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
        layout={LinearTransition.springify().damping(80).stiffness(200)}
        className="justify-center self-center"
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
  const [activeItemWidth, setActiveItemWidth] = useState(
    SCREEN_WIDTH / state.routes.length,
  );
  const tabPositionX = useSharedValue(0);

  const backgroundStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(tabPositionX.value, {
            duration: 200,
          }),
        },
      ],
      width: activeItemWidth,
    };
  });

  useEffect(() => {
    tabPositionX.value = state.index * activeItemWidth;
  }, [activeItemWidth, state.index, tabPositionX]);

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
          setActiveItemWidth={setActiveItemWidth}
        />
      ))}
    </View>
  );
}
