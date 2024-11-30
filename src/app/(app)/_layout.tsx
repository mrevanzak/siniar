/* eslint-disable react/no-unstable-nested-components */
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Category, Heart, Home } from 'iconsax-react-native';
import React from 'react';
import { Platform } from 'react-native';

import { colors } from '@/components/ui';
import { TabBar } from '@/components/ui/tab-bar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.gray,
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 20,
          fontFamily: Platform.select({
            ios: 'Manrope',
            android: 'Manrope_400Regular',
          }),
          fontWeight: 700,
        },
        headerShadowVisible: false,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} variant="Bold" />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          headerShown: true,
          headerTitle: 'Explore New Podcasts',
          tabBarIcon: ({ color }) => <Category color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          headerShown: true,
          tabBarIcon: ({ color }) => <Heart color={color} />,
        }}
      />
      <Tabs.Screen
        name="downloads"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather size={24} name="download" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
