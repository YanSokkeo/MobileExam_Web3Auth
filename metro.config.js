// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

const { sourceExts, assetExts } = config.resolver;

const defaultSourceExts = [...sourceExts, 'svg', 'mjs', 'cjs'];

config.resolver = {
  extraNodeModules: require('expo-crypto-polyfills'),
  assetExts: assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: process.env.TEST_REACT_NATIVE
    ? ['e2e.js'].concat(defaultSourceExts)
    : defaultSourceExts
};

config.transformer = {
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true
    }
  })
};

module.exports = config;
