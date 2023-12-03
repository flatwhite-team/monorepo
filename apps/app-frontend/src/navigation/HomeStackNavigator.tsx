import { Suspense, useRef } from "react";
import { Characteristic } from "@flatwhite-team/prisma";
import { JoinedStore } from "@flatwhite-team/trpc-server/src/router/store";
import { RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";

import { CenteredActivityIndicator } from "~/components/CenteredActivityIndicator";
import { colors } from "~/constants";
import { 필터_카테고리 } from "~/models/Filters";
import { CustomLocationProvider } from "~/providers/CustomLocationProvider";
import { CustomLocationScreen } from "~/screens/SetLocationScreen/CustomLocationScreen";
import { StoreDetailScreen } from "../screens/StoreDetailScreen/StoreDetailScreen";
import { RootTabNavigator } from "./RootTabNavigator";

export type HomeStackParamList = {
  StoresScreen: undefined;
  StoreDetailScreen: {
    storeId: string;
    selectedMenuId?: string;
  };
  CustomLocationScreen: undefined;
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
        </Stack.Navigator>
      </CustomLocationProvider>
    </Suspense>
  );
}
