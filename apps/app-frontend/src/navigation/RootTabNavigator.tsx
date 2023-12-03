import { RefObject } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Characteristic } from "@flatwhite-team/prisma";
import { JoinedStore } from "@flatwhite-team/trpc-server/src/router/store";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";

import { 필터_카테고리 } from "~/models/Filters";
import { BookmarksScreen } from "~/screens/BookmarksScreen/BookmarksScreen";
import { colors } from "../constants";
import { ContactScreen } from "../screens/ContactScreen/ContactScreen";
import { StoresScreen } from "../screens/StoresScreen/StoresScreen";

export type RootTabParamList = {
  Home: {
    filters?: {
      [필터_카테고리.음식료]?: Characteristic[];
      [필터_카테고리.종류]?: Characteristic[];
      [필터_카테고리.분위기]?: Characteristic[];
      [필터_카테고리.시설]?: Characteristic[];
    };
  };
  BookmarksScreen: undefined;
  ContactScreen: undefined;
};

export type HomeTabNavigationProp = NativeStackNavigationProp<
  RootTabParamList,
  "Home"
>;

export type HomeTabRouteProp = RouteProp<RootTabParamList, "Home">;

const Tab = createBottomTabNavigator<RootTabParamList>();

interface Props {
  storeListRef: RefObject<FlashList<JoinedStore>>;
}

export function RootTabNavigator({ storeListRef }: Props) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarActiveTintColor: colors.primary,
        headerStyle: {
          backgroundColor: colors.background,
        },
        tabBarStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        initialParams={{
          filters: undefined,
        }}
        options={{
          headerShown: false,
          tabBarLabel: "카페",
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "cafe" : "cafe-outline"}
                size={24}
                color={focused ? colors.primary : colors.gray400}
              />
            );
          },
        }}
      >
        {(props) => {
          return <StoresScreen storeListRef={storeListRef} {...props} />;
        }}
      </Tab.Screen>
      <Tab.Screen
        name="BookmarksScreen"
        component={BookmarksScreen}
        options={{
          headerTitle: "찜",
          tabBarLabel: "찜",
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
                size={24}
                color={focused ? colors.primary : colors.gray400}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="ContactScreen"
        component={ContactScreen}
        options={{
          headerTitle: "문의",
          tabBarLabel: "문의",
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "mail" : "mail-outline"}
                size={24}
                color={focused ? colors.primary : colors.gray400}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
