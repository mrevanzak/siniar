// Import  global CSS file
import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import type { ReactNode } from 'react';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import TrackPlayer from 'react-native-track-player';

import { APIProvider } from '@/api';
import { FocusAwareStatusBar } from '@/components/ui';
import { playbackService } from '@/constants/playback-service';
import { hydrateAuth, loadSelectedTheme, useSetupPlayer } from '@/lib';
import { useLogPlayerState } from '@/lib/hooks/use-log-player-state';
import { useThemeConfig } from '@/lib/use-theme-config';

export { ErrorBoundary } from 'expo-router';

hydrateAuth();
loadSelectedTheme();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

TrackPlayer.registerPlaybackService(() => playbackService);

export default function RootLayout() {
  return (
    <Providers>
      <Stack initialRouteName="(app)" screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="player"
          options={{
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
            presentation: 'transparentModal',
            gestureDirection: 'vertical',
            animationDuration: 400,
          }}
        />
      </Stack>
    </Providers>
  );
}

function Providers({ children }: { children: ReactNode }) {
  const theme = useThemeConfig();
  const handleTrackPlayerLoaded = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  useSetupPlayer({
    onLoad: handleTrackPlayerLoaded,
  });
  useLogPlayerState();

  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? 'dark' : undefined}
    >
      <KeyboardProvider>
        <ThemeProvider value={theme}>
          <APIProvider>
            <BottomSheetModalProvider>
              <FocusAwareStatusBar />
              {children}
              <FlashMessage position="top" />
            </BottomSheetModalProvider>
          </APIProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
