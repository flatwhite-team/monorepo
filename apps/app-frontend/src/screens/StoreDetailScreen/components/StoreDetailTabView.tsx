import { useWindowDimensions, Text } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { InfoTabContent } from "./InfoTabContent";
import { useState } from "react";
import { MenuTabContent } from "./MenuTabContent";
import { colors } from "../../../constants";

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
              backgroundColor: "white",
            }}
            labelStyle={{
              color: "black",
              fontSize: 16,
            }}
            renderLabel={({ route, focused }) => {
              return (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: focused ? "bold" : "normal",
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
