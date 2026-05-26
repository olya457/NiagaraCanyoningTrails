import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Screen} from '../components/Screen';
import {TrailCard} from '../components/TrailCard';
import {trails} from '../data/trails';
import {useSavedTrails} from '../storage/SavedTrailsContext';
import {colors} from '../theme';
import {shareTrail} from '../utils/share';

type Props = {
  onOpenTrail: (trailId: string) => void;
};

export function HomeScreen({onOpenTrail}: Props): React.JSX.Element {
  const {isSaved, toggleSaved} = useSavedTrails();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.kicker}>NIAGARA REGION</Text>
        <Text
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.82}
          style={styles.title}>
          Canyoning Locations
        </Text>
      </View>

      {trails.map(trail => (
        <TrailCard
          key={trail.id}
          trail={trail}
          saved={isSaved(trail.id)}
          onOpen={onOpenTrail}
          onSave={toggleSaved}
          onShare={shareTrail}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 18,
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
});
