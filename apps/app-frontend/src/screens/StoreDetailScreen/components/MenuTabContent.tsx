import { Suspense } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

import { CenteredActivityIndicator } from "../../../components/CenteredActivityIndicator";
import { HomeStackParamList } from "../../../navigation/HomeStackNavigator";
import { api } from "../../../utils/api";
import { MenuItem } from "./MenuItem";

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
  const { data: menus } = api.menu.findByStoreId.useQuery(storeId);

  if (menus == null) {
    throw new Error("메뉴를 불러오지 못했습니다.");
  }

  return menus.length > 0 ? (
    <FlatList
      data={menus}
      renderItem={({ item }) => {
        return <MenuItem {...item} />;
      }}
    />
  ) : (
    <Text className="mt-5 text-center text-base text-gray-700">
      가게에 문의해주세요.
    </Text>
  );
}
