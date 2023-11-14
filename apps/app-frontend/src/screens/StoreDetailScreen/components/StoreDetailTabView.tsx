import { useState } from "react";
import { Text, useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

import { colors } from "../../../constants";
import { InfoTabContent } from "./InfoTabContent";
import { MenuTabContent } from "./MenuTabContent";

const renderScene = SceneMap({
  info: InfoTabContent,
  menu: MenuTabContent,
});

const tabs = [
  { key: "info", title: "정보" },
  { key: "menu", title: "메뉴" },
];

export function StoreDetailTabView() {
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
      initialLayout={{ width: layout.width }}
      lazy={true}
    />
  );
}
