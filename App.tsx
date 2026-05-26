import React from 'react';
import {StatusBar} from 'react-native';
import {GalleryProvider} from './src/storage/GalleryContext';
import {SavedTrailsProvider} from './src/storage/SavedTrailsContext';
import {AppNavigator} from './src/navigation/AppNavigator';
import {colors} from './src/theme';

function App(): React.JSX.Element {
  return (
    <SavedTrailsProvider>
      <GalleryProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.forest}
          translucent={false}
        />
        <AppNavigator />
      </GalleryProvider>
    </SavedTrailsProvider>
  );
}

export default App;
