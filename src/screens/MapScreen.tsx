import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import MapView, {Marker, type Region} from 'react-native-maps';
import {difficultyStars, trailById, trails} from '../data/trails';
import {colors, layout} from '../theme';
import {shareTrail} from '../utils/share';

const initialRegion: Region = {
  latitude: 43.098,
  longitude: -79.12,
  latitudeDelta: 0.085,
  longitudeDelta: 0.11,
};

const mapStyle = [
  {elementType: 'geometry', stylers: [{color: '#092f1c'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#7aa39c'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#092f1c'}]},
  {featureType: 'water', elementType: 'geometry', stylers: [{color: '#123f49'}]},
  {featureType: 'road', elementType: 'geometry', stylers: [{color: '#1c5137'}]},
  {featureType: 'poi.park', elementType: 'geometry', stylers: [{color: '#0f3c26'}]},
];

type Props = {
  focusedTrailId?: string | null;
  onOpenTrail: (trailId: string) => void;
};

export function MapScreen({
  focusedTrailId,
  onOpenTrail,
}: Props): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 720 || width < 380;
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region>(initialRegion);
  const [selectedId, setSelectedId] = useState<string | null>(
    focusedTrailId ?? null,
  );
  const selectedTrail = selectedId ? trailById[selectedId] : null;

  function moveMap(nextRegion: Region) {
    setRegion(nextRegion);
    mapRef.current?.animateToRegion(nextRegion, 260);
  }

  function openMarker(trailId: string) {
    const trail = trailById[trailId];

    if (!trail) {
      return;
    }

    setSelectedId(trailId);
    moveMap({
      latitude: trail.coordinates.latitude,
      longitude: trail.coordinates.longitude,
      latitudeDelta: Math.min(region.latitudeDelta, 0.06),
      longitudeDelta: Math.min(region.longitudeDelta, 0.08),
    });
  }

  function zoom(multiplier: number) {
    moveMap({
      ...region,
      latitudeDelta: Math.max(0.012, Math.min(0.14, region.latitudeDelta * multiplier)),
      longitudeDelta: Math.max(0.016, Math.min(0.18, region.longitudeDelta * multiplier)),
    });
  }

  function recenter() {
    moveMap(selectedTrail ? {
      latitude: selectedTrail.coordinates.latitude,
      longitude: selectedTrail.coordinates.longitude,
      latitudeDelta: 0.06,
      longitudeDelta: 0.08,
    } : initialRegion);
  }

  useEffect(() => {
    if (focusedTrailId) {
      const trail = trailById[focusedTrailId];

      if (!trail) {
        return;
      }

      const nextRegion = {
        latitude: trail.coordinates.latitude,
        longitude: trail.coordinates.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.08,
      };

      setSelectedId(focusedTrailId);
      setRegion(nextRegion);
      mapRef.current?.animateToRegion(nextRegion, 260);
    }
  }, [focusedTrailId]);

  return (
    <View style={[styles.root, compact && styles.rootCompact]}>
      <View style={[styles.header, compact && styles.headerCompact]}>
        <Text style={styles.kicker}>NIAGARA REGION</Text>
        <Text style={styles.title}>Explorer Map</Text>
      </View>

      <View style={[styles.mapShell, compact && styles.mapShellCompact]}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={initialRegion}
          region={region}
          onRegionChangeComplete={setRegion}
          customMapStyle={mapStyle}
          showsCompass={false}
          showsUserLocation={false}
          toolbarEnabled={false}>
          {trails.map(trail => {
            const selected = trail.id === selectedId;

            return (
              <Marker
                key={trail.id}
                coordinate={trail.coordinates}
                onPress={() => openMarker(trail.id)}>
                <View style={[styles.marker, selected && styles.markerActive]} />
              </Marker>
            );
          })}
        </MapView>

        <View style={styles.legend}>
          <LegendDot color={colors.mint} label="Waterfalls" />
          <LegendDot color={colors.gold} label="River Canyons" />
          <LegendDot color="#9bb676" label="Rock Trails" />
        </View>

        <View style={styles.mapControls}>
          <MapControl label="+" onPress={() => zoom(0.62)} />
          <MapControl label="−" onPress={() => zoom(1.45)} />
          <MapControl label="◎" onPress={recenter} />
        </View>
      </View>

      {selectedTrail && (
        <View style={styles.popupBackdrop} pointerEvents="box-none">
          <View style={styles.selectedCard}>
            <Image
              source={selectedTrail.image}
              resizeMode="cover"
              style={styles.selectedImage}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => setSelectedId(null)}
              style={styles.popupCloseButton}>
              <Text style={styles.popupCloseText}>×</Text>
            </Pressable>
            <View style={styles.selectedBody}>
              <View style={styles.selectedHeader}>
                <Text style={styles.selectedTag}>WATERFALLS</Text>
                <Text style={styles.stars}>{difficultyStars(selectedTrail.difficulty)}</Text>
              </View>
              <Text numberOfLines={1} style={styles.selectedTitle}>
                {selectedTrail.name}
              </Text>
              <Text numberOfLines={1} style={styles.selectedCoord}>
                ⌾ {selectedTrail.coordinates.latitude.toFixed(4)}° N, {Math.abs(selectedTrail.coordinates.longitude).toFixed(4)}° W
              </Text>
              <View style={styles.selectedActions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => shareTrail(selectedTrail)}
                  style={styles.shareButton}>
                  <Text style={styles.actionText}>↗ Share</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onOpenTrail(selectedTrail.id)}
                  style={styles.openButton}>
                  <Text style={styles.openText}>Open ›</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function MapControl({label, onPress}: {label: string; onPress: () => void}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.mapControl}>
      <Text style={styles.mapControlText}>{label}</Text>
    </Pressable>
  );
}

function LegendDot({color, label}: {color: string; label: string}) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.legendDot, {backgroundColor: color}]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.forest,
    paddingTop: layout.screenTop + layout.statusContentOffset + 42,
    paddingHorizontal: 16,
    paddingBottom: layout.navHeight + layout.navBottom + 10,
  },
  rootCompact: {
    paddingTop: layout.screenTop + layout.statusContentOffset + 26,
    paddingBottom: layout.navHeight + layout.navBottom + 8,
  },
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
  mapShell: {
    flex: 1,
    minHeight: 420,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.panel,
  },
  mapShellCompact: {
    minHeight: 340,
  },
  marker: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.mint,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  markerActive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: colors.mint,
    backgroundColor: 'rgba(127,199,199,0.28)',
  },
  legend: {
    position: 'absolute',
    left: 14,
    bottom: 14,
    borderRadius: 8,
    backgroundColor: 'rgba(6,40,24,0.82)',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: colors.stone,
    fontSize: 11,
  },
  mapControls: {
    position: 'absolute',
    right: 14,
    top: 14,
    gap: 8,
  },
  mapControl: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(6,40,24,0.84)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapControlText: {
    color: colors.gold,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 24,
  },
  popupBackdrop: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 0,
    bottom: layout.navBottom + layout.navHeight + 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCard: {
    width: '100%',
    maxWidth: 360,
    minHeight: 252,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: 112,
    backgroundColor: colors.moss,
  },
  popupCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(6,40,24,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupCloseText: {
    color: colors.sand,
    fontSize: 25,
    lineHeight: 27,
  },
  selectedBody: {
    minWidth: 0,
    padding: 14,
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedTag: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  selectedTitle: {
    color: colors.sand,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 10,
  },
  selectedCoord: {
    color: colors.mint,
    fontSize: 11,
    marginTop: 3,
  },
  stars: {
    color: colors.gold,
    fontSize: 13,
  },
  selectedActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  shareButton: {
    flex: 1,
    minHeight: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openButton: {
    flex: 1.5,
    minHeight: 36,
    borderRadius: 8,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '900',
  },
  openText: {
    color: colors.deepForest,
    fontSize: 13,
    fontWeight: '900',
  },
});
