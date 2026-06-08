const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");
const MetroCache = require("metro-cache");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Limit workers and use a project-local cache on Windows to avoid EMFILE.
config.maxWorkers = process.platform === "win32" ? 2 : 4;
config.cacheStores = [
  new MetroCache.FileStore({
    root: path.join(__dirname, ".metro-cache"),
  }),
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === "web" &&
    ["@expo/ui/swift-ui", "@expo/ui/swift-ui/modifiers"].includes(moduleName)
  ) {
    return {
      type: "empty",
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./src/global.css",
  debug: false,
});
