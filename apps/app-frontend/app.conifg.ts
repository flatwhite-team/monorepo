import { ConfigContext, ExpoConfig } from "@expo/config";

import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    owner: "flatwhite-team",
    name: "플랫화이트",
    slug: "flatwhite",
    version: "1.0.8",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#222222",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "cafe.flatwhite",
      infoPlist: {
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "현재 위치를 중심으로 주변 카페를 찾습니다.",
        NSLocationAlwaysUsageDescription:
          "현재 위치를 중심으로 주변 카페를 찾습니다.",
        NSLocationWhenInUseUsageDescription:
          "현재 위치를 중심으로 주변 카페를 찾습니다.",
      },
      config: {
        googleMapsApiKey: process.env.IOS_GOOGLE_CLOUD_API_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#222222",
      },
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
      ],
      package: "cafe.flatwhite",
      config: {
        googleMaps: {
          apiKey: process.env.ANDROID_GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      favicon: "./assets/icon.png",
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "현재 위치를 중심으로 주변 카페를 찾습니다.",
          locationAlwaysPermission:
            "현재 위치를 중심으로 주변 카페를 찾습니다.",
          locationWhenInUsePermission:
            "현재 위치를 중심으로 주변 카페를 찾습니다.",
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "61cb9615-8517-4d8a-896c-70ee2b6d7b4c",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/61cb9615-8517-4d8a-896c-70ee2b6d7b4c",
    },
  };
};
