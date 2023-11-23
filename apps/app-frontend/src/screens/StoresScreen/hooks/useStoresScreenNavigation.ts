import { Characteristic } from "@flatwhite-team/prisma";
import { useNavigation, useRoute } from "@react-navigation/native";

import { 필터_카테고리 } from "~/models/Filters";
import {
  StoresScreenNavigationProp,
  StoresScreenRouteProp,
} from "~/navigation/HomeStackNavigator";

export function useStoresScreenNavigation() {
  const navigation = useNavigation<StoresScreenNavigationProp>();
  const {
    params: { filters },
  } = useRoute<StoresScreenRouteProp>();

  return {
    ...navigation,
    setCategoryFilters: (
      targetCategory: 필터_카테고리,
      newFilters: Characteristic[],
    ) => {
      navigation.setParams({
        filters: {
          ...filters,
          [targetCategory]: newFilters,
        },
      });
    },
    resetFilters: () => {
      navigation.setParams({ filters: undefined });
    },
  };
}
