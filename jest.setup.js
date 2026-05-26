jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-maps', () => {
  const React = require('react');
  const {View} = require('react-native');
  const MockMapView = ({children, ...props}) =>
    React.createElement(View, props, children);
  const MockMarker = ({children}) => React.createElement(View, null, children);

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(() =>
    Promise.resolve({
      didCancel: true,
      assets: [],
    }),
  ),
}));
