import React, { forwardRef } from 'react';
import type { TextProps, TextStyle } from 'react-native';
import { I18nManager, StyleSheet,Text as NNText } from 'react-native';
import { twMerge } from 'tailwind-merge';

import type { TxKeyPath } from '@/lib/i18n';
import { translate } from '@/lib/i18n';

interface Props extends TextProps {
  className?: string;
  tx?: TxKeyPath;
}

export const Text = forwardRef<NNText, Props>(
  ({ className, tx, children, style, ...props }, ref) => {
    const textStyle = React.useMemo(
      () =>
        twMerge(
          'text-base text-black  dark:text-white font-manrope font-normal',
          className,
        ),
      [className],
    );

    const nStyle = React.useMemo(
      () =>
        StyleSheet.flatten([
          {
            writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
          },
          style,
        ]) as TextStyle,
      [style],
    );
    return (
      <NNText ref={ref} className={textStyle} style={nStyle} {...props}>
        {tx ? translate(tx) : children}
      </NNText>
    );
  },
);
