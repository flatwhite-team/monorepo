import { Characteristic } from "@flatwhite-team/prisma";
import { useNavigation, useRoute } from "@react-navigation/native";

import { 필터_카테고리 } from "~/models/Filters";
import {
  HomeTabNavigationProp,
  HomeTabRouteProp,
} from "~/navigation/RootTabNavigator";

export function useStoresScreenNavigation() {
  const navigation = useNavigation<HomeTabNavigationProp>();
  const {
    params: { filters },
  } = useRoute<HomeTabRouteProp>();

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
