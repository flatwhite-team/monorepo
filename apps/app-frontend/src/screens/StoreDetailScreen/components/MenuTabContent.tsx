import { Suspense } from "react";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";

import { CenteredActivityIndicator } from "../../../components/CenteredActivityIndicator";
import {
  StoreDetailScreenNavigationProp,
  StoreDetailScreenRouteProp,
} from "../../../navigation/HomeStackNavigator";
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
  const navigation = useNavigation<StoreDetailScreenNavigationProp>();
  const {
    params: { storeId },
  } = useRoute<StoreDetailScreenRouteProp>();
  const { data: menus } = api.menu.findByStoreId.useQuery(storeId);

  if (menus == null) {
    throw new Error("메뉴를 불러오지 못했습니다.");
  }

  return menus.length > 0 ? (
    <FlashList
      data={menus}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.setParams({
                selectedMenuId: item.id,
              });
            }}
          >
            <MenuItem {...item} />
          </TouchableOpacity>
        );
      }}
      estimatedItemSize={120}
    />
  ) : (
    <Text className="mt-5 text-center text-base text-gray-700">
      가게에 문의해주세요.
    </Text>
  );
}
