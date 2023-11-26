import { StatusBar, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { TamaguiProvider } from "tamagui";

import { styles } from "../styles/commonStyle";
import config from "../tamagui.config";
import CustomErrorBoundary from "./components/CustomErrorBoundary";
import { colors } from "./constants";
import { HomeStackNavigator } from "./navigation/HomeStackNavigator";
import { TRPCProvider } from "./utils/api";

export default function App() {
  return (
    <TamaguiProvider config={config}>
      <CustomErrorBoundary
        renderFallback={() => (
          <View
            style={{
              ...styles.container,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Text>에러발생!</Text>
          </View>
        )}
      >
        <TRPCProvider>
          <SafeAreaProvider>
            <RootSiblingParent>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={styles.container}>
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
