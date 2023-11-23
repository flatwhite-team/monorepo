import { Suspense } from "react";
import { Characteristic } from "@flatwhite-team/prisma";
import { RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { CenteredActivityIndicator } from "~/components/CenteredActivityIndicator";
import { colors } from "~/constants";
import { 필터_카테고리 } from "~/models/Filters";
import { CustomLocationProvider } from "~/providers/CustomLocationProvider";
import { CustomLocationScreen } from "~/screens/SetLocationScreen/CustomLocationScreen";
import { StoreDetailScreen } from "../screens/StoreDetailScreen/StoreDetailScreen";
import { RootTabNavigator } from "./RootTabNavigator";

export type HomeStackParamList = {
  StoresScreen: {
    filters?: {
      [필터_카테고리.음식료]?: Characteristic[];
      [필터_카테고리.종류]?: Characteristic[];
      [필터_카테고리.분위기]?: Characteristic[];
      [필터_카테고리.시설]?: Characteristic[];
    };
  };
  StoreDetailScreen: { storeId: string };
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
