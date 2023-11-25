import { RefObject } from "react";
import { Ionicons } from "@expo/vector-icons";
import { JoinedStore } from "@flatwhite-team/trpc-server/src/router/store";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FlashList } from "@shopify/flash-list";

import { colors } from "../constants";
import { ContactScreen } from "../screens/ContactScreen/ContactScreen";
import { StoresScreen } from "../screens/StoresScreen/StoresScreen";

const Tab = createBottomTabNavigator();

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
                name="cafe"
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
        name="ContactScreen"
        component={ContactScreen}
        options={{
          headerTitle: "문의",
          tabBarLabel: "문의",
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name="mail"
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
