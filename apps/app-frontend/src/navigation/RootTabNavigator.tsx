import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { colors } from "../constants";
import { ContactScreen } from "../screens/ContactScreen/ContactScreen";
import { StoresScreen } from "../screens/StoresScreen/StoresScreen";

const Tab = createBottomTabNavigator();

export function RootTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarActiveTintColor: colors.primary,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={StoresScreen}
        options={{
          headerShown: false,
          tabBarLabel: "카페",
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name="cafe"
                size={24}
                color={focused ? colors.primary : colors.gray}
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
                name="mail"
                size={24}
                color={focused ? colors.primary : colors.gray}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
