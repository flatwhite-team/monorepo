import React, { Suspense } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

import { CenteredActivityIndicator } from "../../components/CenteredActivityIndicator";
import { colors } from "../../constants";
import { HomeStackParamList } from "../../navigation/HomeStackNavigator";
import { api } from "../../utils/api";
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
        <Text className="px-6 text-2xl font-semibold">{store.name}</Text>
        <StoreDetailTabView />
      </View>
    </View>
  );
}
