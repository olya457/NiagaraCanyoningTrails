import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors, layout} from '../theme';
import type {TabKey} from '../types/app';

type TabConfig = {
  key: TabKey;
  label: string;
  icon: string;
};

const tabs: TabConfig[] = [
  {key: 'locations', label: 'Places', icon: '📍'},
  {key: 'map', label: 'Map', icon: '🗺️'},
  {key: 'saved', label: 'Saved', icon: '♡'},
  {key: 'gallery', label: 'Gallery', icon: '📷'},
  {key: 'quiz', label: 'Quiz', icon: '🧠'},
  {key: 'safety', label: 'Tips', icon: '💡'},
];

type Props = {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
};

export function FloatingTabBar({
  activeTab,
  onTabPress,
}: Props): React.JSX.Element {
  return (
    <View style={styles.wrap}>
      {tabs.map(tab => {
        const active = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            onPress={() => onTabPress(tab.key)}
            style={styles.tab}>
            <View style={styles.indicatorWrap}>
              {active && <View style={styles.indicator} />}
            </View>
            <Text
              accessibilityLabel={tab.label}
              style={[styles.icon, active && styles.iconActive]}>
              {tab.icon}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: layout.navBottom,
    height: layout.navHeight,
    borderTopWidth: 1,
    borderColor: 'rgba(212,170,46,0.18)',
    backgroundColor: colors.panelStrong,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  tab: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  icon: {
    color: 'rgba(232,247,243,0.72)',
    fontSize: 22,
  },
  iconActive: {
    color: colors.gold,
  },
  indicatorWrap: {
    height: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: 20,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
});
