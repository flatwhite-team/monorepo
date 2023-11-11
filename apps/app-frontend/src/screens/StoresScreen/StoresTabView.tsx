import { useState } from "react";
import { Text, useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

import { colors } from "~/constants";
import { StoreListTabContent } from "./StoreListTab/StoreListTabContent";
import { StoreMapTabContent } from "./StoreMapTab/StoreMapTabContent";

const renderScene = SceneMap({
  list: StoreListTabContent,
  map: StoreMapTabContent,
});

const tabs = [
  { key: "list", title: "목록" },
  { key: "map", title: "지도" },
];

export function StoresTabView() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  return (
    <TabView
      renderTabBar={(props) => {
        return (
          <TabBar
            indicatorStyle={{
              backgroundColor: colors.primary,
            }}
            style={{
              backgroundColor: colors.background,
            }}
            labelStyle={{
              fontSize: 16,
            }}
            renderLabel={({ route, focused }) => {
              return (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: focused ? "700" : "500",
                    color: focused ? colors.primary : colors.gray500,
                  }}
                >
                  {route.title}
                </Text>
              );
            }}
            {...props}
          />
        );
      }}
      navigationState={{ index, routes: tabs }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width, height: layout.height }}
      lazy={true}
    />
  );
}
