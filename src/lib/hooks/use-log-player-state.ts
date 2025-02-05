import { Env } from '@env';
import { Event, useTrackPlayerEvents } from 'react-native-track-player';

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackActiveTrackChanged,
];

export const useLogPlayerState = () => {
  useTrackPlayerEvents(events, async (event) => {
    if (Env.APP_ENV !== 'development') return;

    if (event.type === Event.PlaybackError) {
      console.warn('An error occurred: ', event);
    }

    if (event.type === Event.PlaybackState) {
      console.log('Playback state: ', event.state);
    }

    if (event.type === Event.PlaybackActiveTrackChanged) {
      console.log('Track changed', event.index);
    }
  });
};
