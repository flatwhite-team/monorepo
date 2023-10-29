import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootTabNavigator } from "./RootTabNavigator";
import { StoreDetailScreen } from "../screens/StoreDetailScreen/StoreDetailScreen";

export type HomeStackParamList = {
  StoreListScreen: undefined;
  StoreDetailScreen: { storeId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="StoreListScreen">
      <Stack.Screen
        name="StoreListScreen"
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
    </Stack.Navigator>
  );
}
