import { StatusBar, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { TamaguiProvider } from "tamagui";

import config from "../tamagui.config";
import CustomErrorBoundary from "./components/CustomErrorBoundary";
import { colors } from "./constants";
import { HomeStackNavigator } from "./navigation/HomeStackNavigator";
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
                    <HomeStackNavigator />
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
