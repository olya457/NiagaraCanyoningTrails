import React, {useMemo, useState} from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import type {ImageSourcePropType} from 'react-native';
import {images} from '../assets';
import {PrimaryButton} from '../components/PrimaryButton';
import {colors, clamp, layout} from '../theme';

type Slide = {
  title: string;
  text: string;
  background: ImageSourcePropType;
};

const slides: Slide[] = [
  {
    title: 'Welcome to Niagara Canyoning',
    text: 'Explore waterfall canyons and concealed river routes across Niagara.',
    background: images.onboardingOne,
  },
  {
    title: 'Discover Scenic Routes',
    text: 'Browse rocky waterfalls, cliff passages, and canyon adventures.',
    background: images.onboardingTwo,
  },
  {
    title: 'Save Your Favorite Places',
    text: 'Collect locations, upload photos, and build your canyoning journey.',
    background: images.onboardingThree,
  },
  {
    title: 'Find Your Perfect Route',
    text: 'Complete the canyoning quiz and receive personalized location recommendations.',
    background: images.onboardingFour,
  },
];

type Props = {
  onDone: () => void;
};

export function OnboardingScreen({onDone}: Props): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const {height, width} = useWindowDimensions();
  const slide = slides[index];
  const isLast = index === slides.length - 1;
  const compactHeight = height < 720;
  const narrow = width < 360;
  const topOffset = layout.screenTop + layout.statusContentOffset + 80;
  const bottomPadding = layout.navBottom + (compactHeight ? 24 : 52);
  const bottomGap = compactHeight ? 12 : 18;
  const titleSize = clamp(width * 0.078, 25, compactHeight ? 28 : 30);
  const titleLineHeight = titleSize + 5;

  const dots = useMemo(() => slides.map((_, dotIndex) => dotIndex), []);

  function next() {
    if (isLast) {
      onDone();
      return;
    }
    setIndex(value => value + 1);
  }

  return (
    <ImageBackground
      source={slide.background}
      resizeMode="cover"
      style={styles.root}>
      <View style={[styles.top, {top: topOffset}]}>
        <View style={styles.dots}>
          {dots.map(dot => (
            <View
              key={dot}
              style={[styles.dot, dot === index && styles.dotActive]}
            />
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onDone}
          style={styles.skipButton}>
          <Text style={[styles.skipText, styles.imageTextShadow]}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.fade} />

      <View style={[styles.bottom, {gap: bottomGap, paddingBottom: bottomPadding}]}>
        <View style={styles.goldLine} />
        <Text
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.82}
          style={[
            styles.title,
            styles.imageTextShadow,
            {fontSize: titleSize, lineHeight: titleLineHeight},
          ]}>
          {slide.title}
        </Text>
        <Text
          numberOfLines={compactHeight || narrow ? 2 : 3}
          style={[
            styles.text,
            styles.imageTextShadow,
            compactHeight && styles.textCompact,
          ]}>
          {slide.text}
        </Text>
        <PrimaryButton
          label={isLast ? 'GET STARTED' : 'NEXT'}
          onPress={next}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.forest,
  },
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 42,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  skipButton: {
    position: 'absolute',
    right: 20,
    top: 1,
    minWidth: 54,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  fade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 28,
    zIndex: 2,
  },
  goldLine: {
    width: 48,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(212,170,46,0.38)',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.gold,
  },
  title: {
    color: colors.white,
    fontWeight: '900',
    letterSpacing: 0,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  textCompact: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  imageTextShadow: {
    textShadowColor: 'rgba(0,0,0,0.84)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 8,
  },
});
