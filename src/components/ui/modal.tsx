/**
 * Modal
 * Dependencies:
 * - @gorhom/bottom-sheet.
 *
 * Props:
 * - All `BottomSheetModalProps` props.
 * - `title` (string | undefined): Optional title for the modal header.
 *
 * Usage Example:
 * import { Modal, useModal } from '@gorhom/bottom-sheet';
 *
 * function DisplayModal() {
 *   const { ref, present, dismiss } = useModal();
 *
 *   return (
 *     <View>
 *       <Modal
 *         snapPoints={['60%']} // optional
 *         title="Modal Title"
 *         ref={ref}
 *       >
 *         Modal Content
 *       </Modal>
 *     </View>
 *   );
 * }
 *
 */

import type {
  BottomSheetBackdropProps,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import { BottomSheetModal, useBottomSheet } from '@gorhom/bottom-sheet';
import * as React from 'react';
import type { StyleProp } from 'react-native';
import { Pressable, type TextStyle, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Path, Svg } from 'react-native-svg';

import { PressableScale } from './pressable-scale';
import { Text } from './text';
import { cn } from './utils';

export type ModalProps = BottomSheetModalProps & {
  headerClassName?: string;
  title?: string;
};

type ModalRef = React.ForwardedRef<BottomSheetModal>;

type ModalHeaderProps = {
  title?: string;
  className?: string;
  titleStyle?: StyleProp<TextStyle>;
  dismiss?: () => void;
  endContent?: React.ReactNode;
  startContent?: React.ReactNode;
};

export const useModal = () => {
  const ref = React.useRef<BottomSheetModal>(null);
  const present = React.useCallback((data?: any) => {
    ref.current?.present(data);
  }, []);
  const dismiss = React.useCallback(() => {
    ref.current?.dismiss();
  }, []);
  return { ref, present, dismiss };
};

export const Modal = React.forwardRef(
  (
    {
      snapPoints: _snapPoints = ['60%'],
      title,
      detached = false,
      headerClassName,
      ...props
    }: ModalProps,
    ref: ModalRef,
  ) => {
    const detachedProps = React.useMemo(
      () => getDetachedProps(detached),
      [detached],
    );
    const modal = useModal();
    const snapPoints = React.useMemo(() => _snapPoints, [_snapPoints]);

    React.useImperativeHandle(
      ref,
      () => (modal.ref.current as BottomSheetModal) || null,
    );

    const renderHandleComponent = React.useCallback(
      () => (
        <ModalHeader
          title={title}
          dismiss={modal.dismiss}
          className={headerClassName}
        />
      ),
      [title, modal.dismiss, headerClassName],
    );

    return (
      <BottomSheetModal
        {...props}
        {...detachedProps}
        ref={modal.ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={props.backdropComponent || renderBackdrop}
        enableDynamicSizing={false}
        handleComponent={renderHandleComponent}
      />
    );
  },
);

/**
 * Custom Backdrop
 */

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CustomBackdrop = ({ style }: BottomSheetBackdropProps) => {
  const { close } = useBottomSheet();
  return (
    <AnimatedPressable
      onPress={() => close()}
      entering={FadeIn.duration(100)}
      exiting={FadeOut.duration(200)}
      style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.4)' }]}
    />
  );
};

export const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <CustomBackdrop {...props} />
);

/**
 *
 * @param detached
 * @returns
 *
 * @description
 * In case the modal is detached, we need to add some extra props to the modal to make it look like a detached modal.
 */

const getDetachedProps = (detached: boolean) => {
  if (detached) {
    return {
      detached: true,
      bottomInset: 46,
      style: { marginHorizontal: 16, overflow: 'hidden' },
    } as Partial<BottomSheetModalProps>;
  }
  return {} as Partial<BottomSheetModalProps>;
};

/**
 * ModalHeader
 */

export const ModalHeader = React.memo(
  ({
    title,
    dismiss,
    endContent,
    titleStyle,
    startContent,
    className,
  }: ModalHeaderProps) => {
    return (
      <View className={cn('px-3', className)}>
        {/* handle */}
        <View className="h-1 w-6 self-center rounded-full bg-gray" />

        {startContent}
        {title ? (
          <Text
            className="pointer-events-none py-4 text-center font-bold text-[#26313D] dark:text-white"
            style={titleStyle}
          >
            {title}
          </Text>
        ) : (
          <View className="bg-gray-400 dark:bg-gray-700 mb-8 mt-2 h-1 w-12 self-center rounded-lg" />
        )}
        {endContent ? endContent : <CloseButton close={() => dismiss} />}
      </View>
    );
  },
);

const CloseButton = ({ close }: { close: () => void }) => {
  return (
    <PressableScale
      onPress={close}
      className="absolute right-3 top-5 size-[24px] items-center justify-center "
      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      accessibilityLabel="close modal"
      accessibilityRole="button"
      accessibilityHint="closes the modal"
    >
      <Svg
        className="fill-neutral-300 dark:fill-white"
        width={24}
        height={24}
        fill="none"
        viewBox="0 0 24 24"
      >
        <Path d="M18.707 6.707a1 1 0 0 0-1.414-1.414L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293Z" />
      </Svg>
    </PressableScale>
  );
};
