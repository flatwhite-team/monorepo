import { useCallback, useRef, useState } from "react";
import { Text, useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import BottomSheet from "@gorhom/bottom-sheet";

import { colors } from "~/constants";
import { FiltersBottomSheet } from "./components/FiltersBottomSheet";
import { StoreListTabContent } from "./StoreListTab/StoreListTabContent";
import { StoreMapTabContent } from "./StoreMapTab/StoreMapTabContent";

const tabs = [
  { key: "list", title: "목록" },
  { key: "map", title: "지도" },
];

export function StoresTabView() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const filterBottomSheetRef = useRef<BottomSheet>(null);

  const renderScene = useCallback<ReturnType<typeof SceneMap>>(
    ({ route }) => {
      switch (route.key) {
        case "list":
          return (
            <StoreListTabContent filterBottomSheetRef={filterBottomSheetRef} />
          );
        case "map":
          return (
            <StoreMapTabContent filterBottomSheetRef={filterBottomSheetRef} />
          );
        default:
          throw new Error(`Unknown route: ${route.key}`);
      }
    },
    [filterBottomSheetRef],
  );

  return (
    <>
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
        swipeEnabled={false}
        navigationState={{ index, routes: tabs }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width, height: layout.height }}
        lazy={true}
      />
      <FiltersBottomSheet ref={filterBottomSheetRef} />
    </>
  );
}
