import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import {colors} from '../theme';

type Props = {
  label: string;
  icon?: string;
  variant?: 'primary' | 'ghost' | 'dark';
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  label,
  icon,
  variant = 'primary',
  onPress,
  disabled,
  style,
}: Props): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        style={[styles.label, variant !== 'primary' && styles.labelLight]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    overflow: 'hidden',
  },
  primary: {
    backgroundColor: colors.gold,
  },
  ghost: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dark: {
    backgroundColor: colors.panelStrong,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.78,
  },
  disabled: {
    opacity: 0.44,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    color: colors.deepForest,
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0,
  },
  labelLight: {
    color: colors.white,
  },
});
