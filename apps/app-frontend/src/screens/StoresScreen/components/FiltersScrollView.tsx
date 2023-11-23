import { ComponentProps, RefObject } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useRoute } from "@react-navigation/native";
import { XStack } from "tamagui";

import { Badge } from "~/components/Badge";
import { getCategoryLabels, 필터_카테고리 } from "~/models/Filters";
import { StoresScreenRouteProp } from "~/navigation/HomeStackNavigator";
import { useStoresScreenNavigation } from "../hooks/useStoresScreenNavigation";

interface Props extends ComponentProps<typeof View> {
  bottomSheetRef: RefObject<BottomSheetMethods>;
}

export function FiltersScrollView({ bottomSheetRef, ...props }: Props) {
  return (
    <View {...props}>
      <ScrollView
        className="px-4"
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <XStack space={4} className="mr-8">
          <ResetBadge />
          {Object.values(필터_카테고리).map((category) => {
            return (
              <CategoryBadge
                key={category}
                category={category}
                bottomSheetRef={bottomSheetRef}
              />
            );
          })}
        </XStack>
      </ScrollView>
    </View>
  );
}

function ResetBadge() {
  const navigation = useStoresScreenNavigation();
  const { params } = useRoute<StoresScreenRouteProp>();
  const active =
    params.filters == null || Object.values(params.filters).flat().length < 1;

  return (
    <Badge
      label="전체"
      active={active}
      onPress={() => {
        navigation.resetFilters();
      }}
    />
  );
}

interface CategoryBadgeProps {
  category: 필터_카테고리;
  bottomSheetRef: RefObject<BottomSheetMethods>;
}

function CategoryBadge({ category, bottomSheetRef }: CategoryBadgeProps) {
  const {
    params: { filters },
  } = useRoute<StoresScreenRouteProp>();
  const categoryFilters = filters?.[category] ?? [];
  const active = categoryFilters.length > 0;
  const 라벨 = getCategoryLabels(category);

  return (
    <Badge
      onPress={() => {
        bottomSheetRef.current?.expand();
      }}
      active={active}
      label={`${필터_카테고리[category]} · ${
        active
          ? `${라벨[categoryFilters[0]]}${
              categoryFilters.length > 1
                ? ` 외 ${categoryFilters.length - 1}`
                : ""
            }`
          : "전체"
      }`}
    />
  );
}
