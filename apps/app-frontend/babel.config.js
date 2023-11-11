module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
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
            "~/screens": "./src/screens",
            "~/utils": "./src/utils",
          },
        },
      ],
    ],
  };
};
