module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            styles: "./styles",
            assets: "./assets",
            "~/components": "./src/components",
            "~/constants": "./src/constants",
            "~/hooks": "./src/hooks",
            "~/images": "./src/images",
            "~/models": "./src/models",
            "~/navigation": "./src/navigation",
            "~/providers": "./src/providers",
            "~/screens": "./src/screens",
            "~/utils": "./src/utils",
          },
        },
      ],
      "nativewind/babel",
      // NOTE: react-native-reanimated/plugin has to be listed last.
      "react-native-reanimated/plugin",
    ],
  };
};
