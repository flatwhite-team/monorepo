import { Suspense } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CenteredActivityIndicator } from "~/components/CenteredActivityIndicator";
import { colors } from "~/constants";
import { CustomLocationProvider } from "~/providers/CustomLocationProvider";
import { CustomLocationScreen } from "~/screens/SetLocationScreen/CustomLocationScreen";
import { StoreDetailScreen } from "../screens/StoreDetailScreen/StoreDetailScreen";
import { RootTabNavigator } from "./RootTabNavigator";

export type HomeStackParamList = {
  StoresScreen: undefined;
  StoreDetailScreen: { storeId: string };
  CustomLocationScreen: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Suspense fallback={<CenteredActivityIndicator size="large" />}>
      <CustomLocationProvider>
        <Stack.Navigator
          initialRouteName="StoresScreen"
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          <Stack.Screen
            name="StoresScreen"
            component={RootTabNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="StoreDetailScreen"
            component={StoreDetailScreen}
            options={{
              title: "카페 상세",
            }}
          />
          <Stack.Screen
            name="CustomLocationScreen"
            component={CustomLocationScreen}
            options={{
              title: "위치 설정",
            }}
          />
        </Stack.Navigator>
      </CustomLocationProvider>
    </Suspense>
  );
}
