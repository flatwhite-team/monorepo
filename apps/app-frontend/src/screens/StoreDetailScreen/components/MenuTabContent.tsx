import { useRoute, RouteProp } from "@react-navigation/native";
import { useMenus } from "../../../hooks/useMenus";
import { HomeStackParamList } from "../../../navigation/HomeStackNavigator";
import { View, Text, FlatList } from "react-native";
import { Suspense } from "react";
import { CenteredActivityIndicator } from "../../../components/CenteredActivityIndicator";
import { StyleSheet } from "react-native";
import MenuItem from "./MenuItem";

export function MenuTabContent() {
  return (
    <Suspense fallback={<CenteredActivityIndicator size="large" />}>
      <Resolved />
    </Suspense>
  );
}

function Resolved() {
  const {
    params: { storeId },
  } = useRoute<RouteProp<HomeStackParamList, "StoreDetailScreen">>();
  const { data: menus } = useMenus(storeId);

  if (menus == null) {
    throw new Error("메뉴를 불러오지 못했습니다.");
  }

  return menus.length > 0 ? (
    <FlatList
      style={MenuTabStyle.flatList}
      data={menus}
      renderItem={({ item }) => {
        return <MenuItem {...item} />;
      }}
    />
  ) : (
    // TODO: 메뉴 없을 때 처리
    <Text style={MenuTabStyle.subText}>가게에 문의해주세요.</Text>
  );
}

const MenuTabStyle = StyleSheet.create({
  flatList: {
    flex: 1,
    width: "100%",
  },
  subText: {
    fontSize: 16,
    marginTop: 20,
  },
});
