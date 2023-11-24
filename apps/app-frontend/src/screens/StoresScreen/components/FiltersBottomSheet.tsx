import { ComponentProps, forwardRef } from "react";
import { useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Characteristic } from "@flatwhite-team/prisma";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useRoute } from "@react-navigation/native";
import { Text, View, YStack } from "tamagui";

import { Badge } from "~/components/Badge";
import { colors } from "~/constants";
import {
  findCategory,
  getCategoryFilters,
  필터_카테고리,
} from "~/models/Filters";
import { StoresScreenRouteProp } from "~/navigation/HomeStackNavigator";
import { useStoresScreenNavigation } from "../hooks/useStoresScreenNavigation";

export const FiltersBottomSheet = forwardRef<BottomSheetMethods>(
  function FiltersBottomSheet(props, ref) {
    const layout = useWindowDimensions();
    const snapPoints = [layout.height - 354];

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose={true}
        handleStyle={{
          backgroundColor: colors.background,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.gray400,
        }}
        backdropComponent={(backdropProps) => {
          return (
            <BottomSheetBackdrop
              {...backdropProps}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              pressBehavior="close"
            />
          );
        }}
        {...props}
      >
        <ScrollView className="bg-background flex-1 px-5 py-1">
          <YStack gap={24} className="pb-8">
            <Section category="음식료" />
            <Section category="종류" />
            <Section category="분위기" />
            <Section category="시설" />
          </YStack>
        </ScrollView>
      </BottomSheet>
    );
  },
);

interface SetionProps {
  category: 필터_카테고리;
}

function Section({ category }: SetionProps) {
  const navigation = useStoresScreenNavigation();
  const { params } = useRoute<StoresScreenRouteProp>();
  const filtered =
    params.filters?.[category] != null &&
    Number(params.filters[category]?.length) > 0;
  const categoryFilters = getCategoryFilters(category);

  return (
    <YStack gap={8}>
      <Text className="text-lg font-semibold text-gray-800">{category}</Text>
      <View className="flex flex-row flex-wrap">
        <Badge
          className="mr-1.5"
          label="전체"
          active={!filtered}
          onPress={() => {
            navigation.setCategoryFilters(category, []);
          }}
          size="large"
        />
        {(Object.keys(categoryFilters) as Characteristic[]).map(
          (characteristic) => {
            return (
              <FilterBadge
                className="mb-2 mr-1.5"
                key={`${category}-${characteristic}`}
                characteristic={characteristic}
                size="large"
              />
            );
          },
        )}
      </View>
    </YStack>
  );
}

interface FilterBadgeProps extends ComponentProps<typeof Badge> {
  characteristic: Characteristic;
}

function FilterBadge({ characteristic, ...props }: FilterBadgeProps) {
  const navigation = useStoresScreenNavigation();
  const {
    params: { filters },
  } = useRoute<StoresScreenRouteProp>();
  const 카테고리 = findCategory(characteristic);
  const 활성화했는가 = Boolean(filters?.[카테고리]?.includes(characteristic));
  const 카테고리_필터_라벨 = getCategoryFilters(카테고리);

  return (
    <Badge
      onPress={() => {
        const oldCategoryFilters = filters?.[카테고리] ?? [];
        const newCategoryFilters = 활성화했는가
          ? oldCategoryFilters.filter((filter) => {
              return filter !== characteristic;
            })
          : [...oldCategoryFilters, characteristic];

        navigation.setCategoryFilters(카테고리, newCategoryFilters);
      }}
      active={활성화했는가}
      label={카테고리_필터_라벨[characteristic]}
      {...props}
    />
  );
}
