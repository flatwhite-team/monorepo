import { forwardRef } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Characteristic } from "@flatwhite-team/prisma";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useRoute } from "@react-navigation/native";
import { Text, XStack, YStack } from "tamagui";

import { Badge } from "~/components/Badge";
import { colors } from "~/constants";
import {
  findCategory,
  getCategoryLabels,
  필터_카테고리,
} from "~/models/Filters";
import { StoresScreenRouteProp } from "~/navigation/HomeStackNavigator";
import { useStoresScreenNavigation } from "../hooks/useStoresScreenNavigation";

export const FiltersBottomSheet = forwardRef<BottomSheetMethods>(
  function FiltersBottomSheet(props, ref) {
    const snapPoints = ["65%"];

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
            <Section
              category="음식료"
              filters={[
                ["SPECIALTY_COFFEE", "DECAFFEINATED_COFFEE", "HAND_DRIP"],
                ["COLD_BREW", "SINGLE_ORIGIN", "ESPRESSO"],
                ["TEA", "VEGAN"],
              ]}
            />
            <Section
              category="종류"
              filters={[
                ["BAKERY", "DESSERT", "BRUNCH", "ROASTERY"],
                ["ESPRESSO_BAR", "STUDY_CAFE"],
              ]}
            />
            <Section
              category="분위기"
              filters={[
                ["CALM", "QUIET", "COZY", "WARM"],
                ["TALK", "FAMILY", "FRIENDS", "DATE", "LONG_HOURS"],
                ["WORK", "MEETING", "STUDY"],
              ]}
            />
            <Section
              category="시설"
              filters={[
                ["WIFI", "OUTDOOR", "PET_FRIENDLY", "OUTLET"],
                ["PARKING", "DRIVE_THRU", "RESERVATION"],
              ]}
            />
          </YStack>
        </ScrollView>
      </BottomSheet>
    );
  },
);

interface SetionProps {
  category: 필터_카테고리;
  filters: Characteristic[][];
}

function Section({ category, filters }: SetionProps) {
  const navigation = useStoresScreenNavigation();
  const { params } = useRoute<StoresScreenRouteProp>();
  const filtered =
    params.filters?.[category] != null &&
    Number(params.filters[category]?.length) > 0;

  return (
    <YStack gap={8}>
      <Text className="text-lg font-semibold text-gray-800">{category}</Text>
      {filters.map((group, index) => {
        return (
          <XStack key={JSON.stringify(group)} gap={6}>
            {index === 0 ? (
              <Badge
                label="전체"
                active={!filtered}
                onPress={() => {
                  navigation.setCategoryFilters(category, []);
                }}
              />
            ) : null}
            {group.map((characteristic) => {
              return (
                <FilterBadge
                  key={`${category}-${characteristic}`}
                  characteristic={characteristic}
                />
              );
            })}
          </XStack>
        );
      })}
    </YStack>
  );
}

interface FilterBadgeProps {
  characteristic: Characteristic;
}

function FilterBadge({ characteristic }: FilterBadgeProps) {
  const navigation = useStoresScreenNavigation();
  const {
    params: { filters },
  } = useRoute<StoresScreenRouteProp>();
  const 카테고리 = findCategory(characteristic);
  const 활성화했는가 = Boolean(filters?.[카테고리]?.includes(characteristic));
  const 카테고리_필터_라벨 = getCategoryLabels(카테고리);

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
    />
  );
}
