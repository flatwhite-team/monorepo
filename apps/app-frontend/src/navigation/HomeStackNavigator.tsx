import { Suspense, useRef } from "react";
import { JoinedStore } from "@flatwhite-team/trpc-server/src/router/store";
import { RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";

import { CenteredActivityIndicator } from "~/components/CenteredActivityIndicator";
import { colors } from "~/constants";
import { CustomLocationProvider } from "~/providers/CustomLocationProvider";
import { CustomLocationScreen } from "~/screens/CustomLocationScreen/CustomLocationScreen";
import { MarkedMapScreen } from "~/screens/MarkedMapScreen/MarkedMapScreen";
import { StoreDetailScreen } from "../screens/StoreDetailScreen/StoreDetailScreen";
import { RootTabNavigator } from "./RootTabNavigator";

export type HomeStackParamList = {
  StoresScreen: undefined;
  StoreDetailScreen: {
    storeId: string;
    selectedMenuId?: string;
  };
  CustomLocationScreen: undefined;
  MarkedMapScreen: {
    latitude: number;
    longitude: number;
  };
};

export type StoresScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "StoresScreen"
>;

export type StoresScreenRouteProp = RouteProp<
  HomeStackParamList,
  "StoresScreen"
>;

export type StoreDetailScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "StoreDetailScreen"
>;

export type StoreDetailScreenRouteProp = RouteProp<
  HomeStackParamList,
  "StoreDetailScreen"
>;

export type MarkedMapScreenRouteProp = RouteProp<
  HomeStackParamList,
  "MarkedMapScreen"
>;

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  const storeListRef = useRef<FlashList<JoinedStore>>(null);

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
            options={{
              headerShown: false,
            }}
          >
            {(props) => {
              return (
                <RootTabNavigator storeListRef={storeListRef} {...props} />
              );
            }}
          </Stack.Screen>
          <Stack.Screen
            name="StoreDetailScreen"
            component={StoreDetailScreen}
            options={{
              title: "카페 상세",
            }}
          />
          <Stack.Screen
            name="CustomLocationScreen"
            options={{
              title: "위치 설정",
            }}
          >
            {(props) => {
              return (
                <CustomLocationScreen storeListRef={storeListRef} {...props} />
              );
            }}
          </Stack.Screen>
          <Stack.Screen
            name="MarkedMapScreen"
            component={MarkedMapScreen}
            options={{
              title: "지도",
            }}
          />
        </Stack.Navigator>
      </CustomLocationProvider>
    </Suspense>
  );
}
