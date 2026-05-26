import React from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {colors, layout} from '../theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  withTabBar?: boolean;
  bottomExtra?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({
  children,
  scroll = true,
  withTabBar = true,
  bottomExtra = 0,
  style,
  contentStyle,
}: Props): React.JSX.Element {
  const {height} = useWindowDimensions();
  const compactHeight = height < 720;
  const topPadding =
    layout.screenTop + layout.statusContentOffset + (compactHeight ? 24 : 42);
  const bottomPadding = withTabBar
    ? layout.navHeight + layout.navBottom + (compactHeight ? 8 : 18) + bottomExtra
    : layout.navBottom + (compactHeight ? 16 : 24) + bottomExtra;

  if (!scroll) {
    return (
      <View style={[styles.root, style]}>
        <View
          style={[
            styles.staticContent,
            {
              paddingTop: layout.screenTop + layout.statusContentOffset,
              paddingBottom: bottomPadding,
            },
            contentStyle,
          ]}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, style]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[
          styles.content,
          {paddingTop: topPadding, paddingBottom: bottomPadding},
          contentStyle,
        ]}>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.forest,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  staticContent: {
    flex: 1,
  },
});
