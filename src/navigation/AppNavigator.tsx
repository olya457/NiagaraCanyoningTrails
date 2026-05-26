import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {FloatingTabBar} from '../components/FloatingTabBar';
import {GalleryScreen} from '../screens/GalleryScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {MapScreen} from '../screens/MapScreen';
import {OnboardingScreen} from '../screens/OnboardingScreen';
import {QuizScreen} from '../screens/QuizScreen';
import {SafetyScreen} from '../screens/SafetyScreen';
import {SavedScreen} from '../screens/SavedScreen';
import {SplashScreen} from '../screens/SplashScreen';
import {TrailDetailScreen} from '../screens/TrailDetailScreen';
import {storageKeys} from '../storage/keys';
import {colors} from '../theme';
import type {TabKey} from '../types/app';

type AppPhase = 'splash' | 'onboarding' | 'main';

export function AppNavigator(): React.JSX.Element {
  const [phase, setPhase] = useState<AppPhase>('splash');
  const [activeTab, setActiveTab] = useState<TabKey>('locations');
  const [detailTrailId, setDetailTrailId] = useState<string | null>(null);
  const [mapFocusTrailId, setMapFocusTrailId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let timerReady = false;
    let storageReady = false;
    let onboardingComplete: string | null = null;
    let timerId: ReturnType<typeof setTimeout>;

    function completeBootstrap() {
      if (!mounted || !timerReady || !storageReady) {
        return;
      }

      setPhase(onboardingComplete === 'true' ? 'main' : 'onboarding');
    }

    AsyncStorage.getItem(storageKeys.onboardingComplete)
      .catch(() => null)
      .then(value => {
        onboardingComplete = value;
        storageReady = true;
        completeBootstrap();
      });

    timerId = setTimeout(() => {
      timerReady = true;
      completeBootstrap();
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(timerId);
    };
  }, []);

  async function finishOnboarding() {
    await AsyncStorage.setItem(storageKeys.onboardingComplete, 'true');
    setPhase('main');
  }

  function openTrail(trailId: string) {
    setDetailTrailId(trailId);
  }

  function openTab(tab: TabKey) {
    setDetailTrailId(null);
    setActiveTab(tab);
  }

  function openMap(trailId: string) {
    setMapFocusTrailId(trailId);
    setDetailTrailId(null);
    setActiveTab('map');
  }

  if (phase === 'splash') {
    return <SplashScreen />;
  }

  if (phase === 'onboarding') {
    return <OnboardingScreen onDone={finishOnboarding} />;
  }

  if (detailTrailId) {
    return (
      <TrailDetailScreen
        trailId={detailTrailId}
        onBack={() => setDetailTrailId(null)}
        onOpenMap={openMap}
      />
    );
  }

  return (
    <View style={styles.root}>
      {activeTab === 'locations' && <HomeScreen onOpenTrail={openTrail} />}
      {activeTab === 'map' && (
        <MapScreen
          focusedTrailId={mapFocusTrailId}
          onOpenTrail={openTrail}
        />
      )}
      {activeTab === 'quiz' && <QuizScreen onOpenTrail={openTrail} />}
      {activeTab === 'saved' && (
        <SavedScreen
          onOpenTrail={openTrail}
          onExplore={() => openTab('locations')}
        />
      )}
      {activeTab === 'gallery' && <GalleryScreen />}
      {activeTab === 'safety' && <SafetyScreen />}
      <FloatingTabBar activeTab={activeTab} onTabPress={openTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.forest,
  },
});
