import React, {useMemo} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {images} from '../assets';
import {PrimaryButton} from '../components/PrimaryButton';
import {Screen} from '../components/Screen';
import {TrailCard} from '../components/TrailCard';
import {trailById} from '../data/trails';
import {useSavedTrails} from '../storage/SavedTrailsContext';
import {colors} from '../theme';
import {shareTrail} from '../utils/share';

type Props = {
  onOpenTrail: (trailId: string) => void;
  onExplore: () => void;
};

export function SavedScreen({
  onOpenTrail,
  onExplore,
}: Props): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const {savedIds, hydrated, isSaved, toggleSaved} = useSavedTrails();
  const compact = height < 720 || width < 380;
  const savedTrails = useMemo(
    () => savedIds.map(id => trailById[id]).filter(Boolean),
    [savedIds],
  );

  return (
    <Screen bottomExtra={compact ? 58 : 18}>
      <View style={[styles.header, compact && styles.headerCompact]}>
        <View>
          <Text style={styles.kicker}>SAVED</Text>
          <Text style={styles.title}>Favorites</Text>
        </View>
        {savedTrails.length > 0 && (
          <Text style={styles.count}>{savedTrails.length} saved</Text>
        )}
      </View>

      {savedTrails.length === 0 ? (
        <View style={[styles.empty, compact && styles.emptyCompact]}>
          <View style={[styles.heartBox, compact && styles.heartBoxCompact]}>
            <Text style={[styles.heart, compact && styles.heartCompact]}>♡</Text>
          </View>
          <Text style={[styles.emptyTitle, compact && styles.emptyTitleCompact]}>
            {hydrated ? 'No saved locations yet' : 'Loading favorites'}
          </Text>
          <Text style={[styles.emptyText, compact && styles.emptyTextCompact]}>
            Explore the Niagara canyoning routes and save your favorites to
            access them here.
          </Text>
          <PrimaryButton
            label="EXPLORE"
            icon="⊙"
            onPress={onExplore}
            style={[styles.exploreButton, compact && styles.exploreButtonCompact]}
          />
          <Image
            source={images.guideMap}
            resizeMode="contain"
            style={[styles.emptyGuide, compact && styles.emptyGuideCompact]}
          />
        </View>
      ) : (
        <View>
          {savedTrails.map(trail => (
            <TrailCard
              key={trail.id}
              compact
              trail={trail}
              saved={isSaved(trail.id)}
              onOpen={onOpenTrail}
              onSave={toggleSaved}
              onShare={shareTrail}
            />
          ))}
        </View>
      )}

      {savedTrails.length > 0 && (
        <Pressable
          accessibilityRole="button"
          onPress={onExplore}
          style={styles.bottomExplore}>
          <Text style={styles.bottomExploreText}>Explore more</Text>
        </Pressable>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
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
  count: {
    color: colors.stone,
    fontSize: 14,
    marginBottom: 5,
  },
  empty: {
    minHeight: 610,
    alignItems: 'center',
    paddingTop: 30,
  },
  emptyCompact: {
    minHeight: 500,
    paddingTop: 10,
  },
  heartBox: {
    width: 80,
    height: 80,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  heartBoxCompact: {
    width: 64,
    height: 64,
    borderRadius: 18,
    marginBottom: 16,
  },
  heart: {
    color: colors.gold,
    fontSize: 38,
  },
  heartCompact: {
    fontSize: 30,
  },
  emptyTitle: {
    color: colors.sand,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0,
  },
  emptyTitleCompact: {
    fontSize: 20,
  },
  emptyText: {
    color: colors.stone,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 26,
  },
  emptyTextCompact: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    paddingHorizontal: 18,
  },
  exploreButton: {
    marginTop: 34,
    width: 160,
  },
  exploreButtonCompact: {
    marginTop: 20,
    minHeight: 46,
  },
  emptyGuide: {
    position: 'absolute',
    bottom: 0,
    width: 215,
    height: 310,
  },
  emptyGuideCompact: {
    width: 176,
    height: 248,
  },
  bottomExplore: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  bottomExploreText: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: '900',
  },
});
