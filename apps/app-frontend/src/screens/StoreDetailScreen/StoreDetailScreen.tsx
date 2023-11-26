import React, { ComponentProps, Suspense, useRef } from "react";
import { Image, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Characteristic } from "@flatwhite-team/prisma";
import BottomSheet from "@gorhom/bottom-sheet";
import { RouteProp, useRoute } from "@react-navigation/native";
import { YStack } from "tamagui";

import { Badge } from "~/components/Badge";
import { findCategory, getCategoryFilters } from "~/models/Filters";
import { CenteredActivityIndicator } from "../../components/CenteredActivityIndicator";
import { HomeStackParamList } from "../../navigation/HomeStackNavigator";
import { api } from "../../utils/api";
import { MenuBottomSheet } from "./components/MenuBottomSheet";
import { StoreDetailTabView } from "./components/StoreDetailTabView";

export function StoreDetailScreen() {
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
  const { data: store } = api.store.findById.useQuery(storeId);
  const menuBottomSheetRef = useRef<BottomSheet>(null);

  if (store == null) {
    throw new Error("상점 정보를 불러오지 못했습니다.");
  }

  return (
    <View className="flex-1">
      <Image
        source={
          store.images.length > 0
            ? { uri: store.images[0].url }
            : require("../../images/icon.png")
        }
        className="h-64 w-full object-cover"
      />
      {/* [TODO] 이미지 슬라이더 */}
      {/* <Swiper
            width={300}
            height={250}
            autoplayTimeout={10}
            showsPagination={true}
          >
            {store.images.map(({ url: uri }, index) => {
              return (
                <View key={index}>
                  <Image source={{ uri }} style={DetailStyle.image} />
                </View>
              );
            })}
          </Swiper> */}
      <View className="bg-background flex-1 gap-y-4">
        <YStack gap={8}>
          {store.characteristics.length > 0 ? (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {store.characteristics.map(({ characteristic }) => {
                return (
                  <CharacteristicBadge
                    key={characteristic}
                    className="mr-1"
                    characteristic={characteristic}
                  />
                );
              })}
            </ScrollView>
          ) : null}
          <Text className="px-5 text-2xl font-semibold">{store.name}</Text>
        </YStack>
        <StoreDetailTabView />
      </View>
      <MenuBottomSheet ref={menuBottomSheetRef} />
    </View>
  );
}

interface CharacteristicBadgeProps extends ComponentProps<typeof Badge> {
  characteristic: Characteristic;
}

function CharacteristicBadge({
  characteristic,
  ...props
}: CharacteristicBadgeProps) {
  const category = findCategory(characteristic);
  const label = getCategoryFilters(category)[characteristic];

  return <Badge size="small" label={label} {...props} />;
}
