import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {PrimaryButton} from '../components/PrimaryButton';
import {Screen} from '../components/Screen';
import {difficultyStars, trailById, trails} from '../data/trails';
import {useSavedTrails} from '../storage/SavedTrailsContext';
import {clamp, colors, layout} from '../theme';
import {shareTrail} from '../utils/share';

type Props = {
  trailId: string;
  onBack: () => void;
  onOpenMap: (trailId: string) => void;
};

export function TrailDetailScreen({
  trailId,
  onBack,
  onOpenMap,
}: Props): React.JSX.Element {
  const trail = trailById[trailId] ?? trails[0];
  const {height, width} = useWindowDimensions();
  const {isSaved, toggleSaved} = useSavedTrails();
  const saved = isSaved(trail.id);
  const compactHeight = height < 720;
  const heroHeight = clamp(height * (compactHeight ? 0.34 : 0.39), 230, 335);
  const titleSize = clamp(width * 0.072, 24, 29);

  return (
    <Screen withTabBar={false} contentStyle={styles.content}>
      <View style={[styles.hero, {height: heroHeight}]}>
        <Image source={trail.image} resizeMode="cover" style={styles.heroImage} />
        <View style={styles.heroScrim} />
        <View style={styles.heroActions}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.iconButton}>
            <Text style={styles.iconText}>←</Text>
          </Pressable>
          <View style={styles.rightActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => shareTrail(trail)}
              style={styles.iconButton}>
              <Text style={styles.iconText}>↗</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => toggleSaved(trail.id)}
              style={[styles.iconButton, saved && styles.favoriteActive]}>
              <Text style={styles.iconText}>{saved ? '♥' : '♡'}</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.heroTextBlock}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>WATERFALLS</Text>
          </View>
          <Text
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            style={[styles.title, {fontSize: titleSize, lineHeight: titleSize + 5}]}>
            {trail.name}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text numberOfLines={1} style={styles.coordinates}>
          ⌾ {trail.coordinates.latitude.toFixed(4)}° N, {Math.abs(trail.coordinates.longitude).toFixed(4)}° W
        </Text>
        <View style={styles.ratingWrap}>
          <Text style={styles.stars}>{difficultyStars(trail.difficulty)}</Text>
          <Text style={styles.level}>
            {trail.difficulty >= 5
              ? 'Expert'
              : trail.difficulty >= 4
                ? 'Advanced'
                : trail.difficulty >= 3
                  ? 'Moderate'
                  : 'Beginner'}
          </Text>
        </View>
      </View>

      <View style={[styles.descriptionCard, compactHeight && styles.descriptionCardCompact]}>
        <View style={styles.goldLine} />
        <Text
          numberOfLines={compactHeight ? 6 : 8}
          style={[styles.description, compactHeight && styles.descriptionCompact]}>
          {trail.description}
        </Text>
      </View>

      <PrimaryButton
        label="OPEN ON MAP"
        icon="🗺️"
        variant="ghost"
        onPress={() => onOpenMap(trail.id)}
        style={styles.mapButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: layout.statusContentOffset,
    paddingHorizontal: 0,
    paddingBottom: 30,
  },
  hero: {
    backgroundColor: colors.moss,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3,27,16,0.2)',
  },
  heroActions: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: layout.screenTop + 54,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(6,40,24,0.76)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteActive: {
    backgroundColor: 'rgba(157,38,33,0.44)',
    borderColor: 'rgba(157,38,33,0.64)',
  },
  iconText: {
    color: colors.sand,
    fontSize: 21,
    fontWeight: '900',
  },
  heroTextBlock: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
  },
  tag: {
    alignSelf: 'flex-start',
    minHeight: 26,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(6,40,24,0.78)',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  tagText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  title: {
    color: colors.sand,
    fontWeight: '900',
    letterSpacing: 0,
  },
  infoCard: {
    marginHorizontal: 16,
    marginTop: 16,
    minHeight: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
  },
  coordinates: {
    flex: 1,
    minWidth: 0,
    color: colors.mint,
    fontSize: 13,
  },
  ratingWrap: {
    alignItems: 'flex-end',
  },
  stars: {
    color: colors.gold,
    fontSize: 15,
    letterSpacing: 0,
  },
  level: {
    color: colors.stone,
    fontSize: 10,
    marginTop: 3,
  },
  descriptionCard: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: 18,
  },
  descriptionCardCompact: {
    padding: 14,
    marginTop: 12,
    marginBottom: 12,
  },
  goldLine: {
    width: 34,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.gold,
    marginBottom: 20,
  },
  description: {
    color: colors.stone,
    fontSize: 15,
    lineHeight: 25,
  },
  descriptionCompact: {
    fontSize: 14,
    lineHeight: 21,
  },
  mapButton: {
    marginHorizontal: 16,
    marginBottom: 6,
    minHeight: 52,
  },
});
