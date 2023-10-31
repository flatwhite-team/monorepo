import { StatusBar, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { styles } from "../styles/commonStyle";
import CustomErrorBoundary from "./components/CustomErrorBoundary";
import { colors } from "./constants";
import { HomeStackNavigator } from "./navigation/HomeStackNavigator";
import { TRPCProvider } from "./utils/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      networkMode: "always",
    },
  },
});

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
          <View style={styles.container}>
            <StatusBar
              barStyle="dark-content"
              backgroundColor={colors.background}
            />
            <NavigationContainer>
              <HomeStackNavigator />
            </NavigationContainer>
          </View>
        </SafeAreaProvider>
      </TRPCProvider>
    </CustomErrorBoundary>
  );
}
