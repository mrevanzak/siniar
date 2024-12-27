import { cssInterop } from 'nativewind';
import { SheetScreen } from 'react-native-sheet-transitions';
import Svg from 'react-native-svg';

export * from './button';
export * from './checkbox';
export { default as colors } from './colors';
export * from './focus-aware-status-bar';
export * from './image';
export * from './input';
export * from './list';
export * from './modal';
export * from './pressable-scale';
export * from './progress-bar';
export * from './select';
export * from './skeleton';
export * from './text';
export * from './utils';

// export base components from react-native
export {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
export { SafeAreaView } from 'react-native-safe-area-context';
export { SheetScreen } from 'react-native-sheet-transitions';

//Apply cssInterop to Svg to resolve className string into style
cssInterop(Svg, {
  className: {
    target: 'style',
  },
});

cssInterop(SheetScreen, {
  className: {
    target: 'style',
  },
});

declare module 'react-native-sheet-transitions' {
  interface Props {
    className?: string;
  }
}
