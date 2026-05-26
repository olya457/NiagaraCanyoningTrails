import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Screen} from '../components/Screen';
import {colors} from '../theme';
import {shareText} from '../utils/share';

const tips = [
  {
    icon: '🌊',
    title: 'WATER SAFETY',
    text: 'Always wear a personal flotation device near rapid or deep water. Never enter the water alone.',
  },
  {
    icon: '🥾',
    title: 'PROPER FOOTWEAR',
    text: 'Use neoprene boots or approach shoes with sticky rubber soles for grip on wet rock surfaces.',
  },
  {
    icon: '🌤️',
    title: 'WEATHER AWARENESS',
    text: 'Check forecasts 48 hours ahead. Avoid canyons immediately after heavy rain.',
  },
  {
    icon: '⛑️',
    title: 'EQUIPMENT BASICS',
    text: 'Bring helmet, harness, waterproof drybag, food, and emergency supplies.',
  },
  {
    icon: '🗺️',
    title: 'ROUTE PREPARATION',
    text: 'Download offline maps before entering canyon zones. Mobile signal is often absent deep in gorges.',
  },
  {
    icon: '🧤',
    title: 'ROCK GRIP',
    text: 'Move slowly on moss-covered rocks and test stability before stepping or climbing.',
  },
  {
    icon: '💧',
    title: 'HYDRATION',
    text: 'Stay hydrated even during cooler weather near waterfalls and shaded canyon walls.',
  },
];

export function SafetyScreen(): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 720 || width < 380;

  return (
    <Screen bottomExtra={compact ? 50 : 18}>
      <View style={[styles.header, compact && styles.headerCompact]}>
        <Text style={styles.kicker}>SAFETY & PREPARATION</Text>
        <Text style={styles.title}>Canyoning Tips</Text>
      </View>

      <View style={[styles.tips, compact && styles.tipsCompact]}>
        {tips.map(tip => (
          <View key={tip.title} style={[styles.tip, compact && styles.tipCompact]}>
            <View style={[styles.iconBox, compact && styles.iconBoxCompact]}>
              <Text style={[styles.icon, compact && styles.iconCompact]}>
                {tip.icon}
              </Text>
            </View>
            <View style={styles.tipBody}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={[styles.tipText, compact && styles.tipTextCompact]}>
                {tip.text}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => shareText(tip.title, tip.text)}
              style={[styles.shareButton, compact && styles.shareButtonCompact]}>
              <Text style={styles.shareIcon}>↗</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 18,
  },
  headerCompact: {
    marginBottom: 12,
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2.2,
  },
  title: {
    color: colors.sand,
    fontSize: 28,
    lineHeight: 33,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 8,
  },
  tips: {
    gap: 13,
  },
  tipsCompact: {
    gap: 10,
  },
  tip: {
    minHeight: 118,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  tipCompact: {
    minHeight: 96,
    gap: 10,
    padding: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxCompact: {
    width: 42,
    height: 42,
    borderRadius: 11,
  },
  icon: {
    fontSize: 24,
  },
  iconCompact: {
    fontSize: 21,
  },
  tipBody: {
    flex: 1,
    minWidth: 0,
  },
  tipTitle: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  tipText: {
    color: colors.stone,
    fontSize: 14,
    lineHeight: 21,
  },
  tipTextCompact: {
    fontSize: 13,
    lineHeight: 19,
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonCompact: {
    width: 32,
    height: 32,
    borderRadius: 9,
  },
  shareIcon: {
    color: colors.stone,
    fontSize: 15,
    fontWeight: '900',
  },
});
