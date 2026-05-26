import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {difficultyStars} from '../data/trails';
import {colors, clamp} from '../theme';
import type {Trail} from '../types/app';

type Props = {
  trail: Trail;
  saved: boolean;
  compact?: boolean;
  onOpen: (trailId: string) => void;
  onSave: (trailId: string) => void;
  onShare: (trail: Trail) => void;
};

export function TrailCard({
  trail,
  saved,
  compact,
  onOpen,
  onSave,
  onShare,
}: Props): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const smallScreen = height < 720 || width < 380;
  const imageHeight = compact
    ? clamp(width * (smallScreen ? 0.26 : 0.3), 94, 132)
    : clamp(width * (smallScreen ? 0.35 : 0.41), 118, 176);

  return (
    <View style={styles.card}>
      <Image
        source={trail.image}
        style={[styles.image, {height: imageHeight}]}
        resizeMode="cover"
      />
      <View style={styles.imageOverlay}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>WATERFALLS</Text>
        </View>
        <View style={styles.imageActions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => onShare(trail)}
            style={styles.iconButton}>
            <Text style={styles.iconText}>↗</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => onSave(trail.id)}
            style={[styles.iconButton, saved && styles.favoriteActive]}>
            <Text style={styles.iconText}>{saved ? '♥' : '♡'}</Text>
          </Pressable>
        </View>
      </View>
      <View style={[styles.body, smallScreen && styles.bodyCompact]}>
        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.title}>
            {trail.name}
          </Text>
          <Text numberOfLines={1} style={styles.coord}>
            ⌾ {trail.coordinates.latitude.toFixed(4)}° N, {Math.abs(trail.coordinates.longitude).toFixed(4)}° W
          </Text>
          <Text style={styles.stars}>{difficultyStars(trail.difficulty)}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => onOpen(trail.id)}
          style={[styles.openButton, smallScreen && styles.openButtonCompact]}>
          <Text style={styles.openText}>Open ›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  image: {
    width: '100%',
    backgroundColor: colors.moss,
  },
  imageOverlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    minHeight: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6,40,24,0.82)',
    paddingHorizontal: 12,
  },
  tagText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(6,40,24,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteActive: {
    backgroundColor: 'rgba(157,38,33,0.42)',
    borderColor: 'rgba(157,38,33,0.62)',
  },
  iconText: {
    color: colors.gold,
    fontSize: 17,
    fontWeight: '900',
  },
  body: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
  },
  bodyCompact: {
    minHeight: 74,
    padding: 12,
    gap: 8,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },
  title: {
    color: colors.sand,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  coord: {
    color: colors.mint,
    fontSize: 12,
    letterSpacing: 0,
  },
  stars: {
    color: colors.gold,
    fontSize: 13,
    letterSpacing: 0,
  },
  openButton: {
    minWidth: 84,
    minHeight: 38,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(212,170,46,0.12)',
  },
  openButtonCompact: {
    minWidth: 76,
    minHeight: 34,
    paddingHorizontal: 10,
  },
  openText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
});
