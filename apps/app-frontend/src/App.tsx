import { StatusBar, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import { styles } from "../styles/commonStyle";
import CustomErrorBoundary from "./components/CustomErrorBoundary";
import { colors } from "./constants";
import { HomeStackNavigator } from "./navigation/HomeStackNavigator";
import { TRPCProvider } from "./utils/api";

export default function App() {
  return (
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
        </SafeAreaProvider>
      </TRPCProvider>
    </CustomErrorBoundary>
  );
}
