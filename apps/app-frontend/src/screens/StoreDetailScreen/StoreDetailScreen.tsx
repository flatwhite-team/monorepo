import React, { Suspense } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

import { CenteredActivityIndicator } from "../../components/CenteredActivityIndicator";
import { colors } from "../../constants";
import { useStore } from "../../hooks/useStore";
import { HomeStackParamList } from "../../navigation/HomeStackNavigator";
import { StoreDetailTabView } from "./components/StoreDetailTabView";

const logoImage = require("../../images/icon.png");

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
  const { data: store } = useStore(storeId);

  if (store == null) {
    throw new Error("상점 정보를 불러오지 못했습니다.");
  }

  return (
    <View style={DetailStyle.container}>
      <Image
        source={
          store.images.length > 0 ? { uri: store.images[0].url } : logoImage
        }
        style={DetailStyle.image}
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
      <View style={DetailStyle.contentWrapper}>
        <Text style={DetailStyle.subTitle}>{store.name}</Text>
        <StoreDetailTabView />
      </View>
    </View>
  );
}

const DetailStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
    gap: 16,
  },
  subTitle: {
    color: "#000000",
    fontSize: 24,
    fontWeight: "600",
  },
  image: {
    resizeMode: "cover",
    width: "100%",
    height: 250,
  },
  storeInfoSection: {
    marginTop: 20,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  infoText: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  icon: {
    width: 20,
    height: 20,
  },
  subText: {
    fontSize: 16,
  },
});
