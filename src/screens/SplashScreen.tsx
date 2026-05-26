import React from 'react';
import {ImageBackground, StatusBar, StyleSheet} from 'react-native';
import {images} from '../assets';
import {colors} from '../theme';

export function SplashScreen(): React.JSX.Element {
  return (
    <ImageBackground
      source={images.loaderScreen}
      resizeMode="stretch"
      style={styles.root}>
      <StatusBar hidden />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.forest,
  },
});
