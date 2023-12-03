import { Suspense } from "react";
import { StatusBar, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { TamaguiProvider } from "tamagui";

import config from "../tamagui.config";
import { CenteredActivityIndicator } from "./components/CenteredActivityIndicator";
import CustomErrorBoundary from "./components/CustomErrorBoundary";
import { colors } from "./constants";
import { HomeStackNavigator } from "./navigation/HomeStackNavigator";
import { AuthSessionProvider } from "./providers/AuthProvider";
import { TRPCProvider } from "./utils/api";

export default function App() {
  return (
    <TamaguiProvider config={config}>
      <CustomErrorBoundary
        renderFallback={() => {
          return (
            <View className="flex-1 items-center justify-center">
              <Text>에러</Text>
            </View>
          );
        }}
      >
        <TRPCProvider>
          <SafeAreaProvider>
            <RootSiblingParent>
              <GestureHandlerRootView className="flex-1">
                <View className="bg-background w-full flex-1">
                  <StatusBar
                    barStyle="dark-content"
                    backgroundColor={colors.background}
                  />
                  <NavigationContainer>
                    <Suspense
                      fallback={<CenteredActivityIndicator size="large" />}
                    >
                      <AuthSessionProvider>
                        <HomeStackNavigator />
                      </AuthSessionProvider>
                    </Suspense>
                  </NavigationContainer>
                </View>
              </GestureHandlerRootView>
            </RootSiblingParent>
          </SafeAreaProvider>
        </TRPCProvider>
      </CustomErrorBoundary>
    </TamaguiProvider>
  );
}
