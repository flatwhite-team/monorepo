import { Suspense } from "react";
import { Platform, ScrollView, Text, View } from "react-native";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { setStringAsync } from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { XStack, YStack } from "tamagui";

import { CenteredActivityIndicator } from "~/components/CenteredActivityIndicator";
import { colors } from "~/constants";
import { BusinessDay } from "~/models/BusinessDay";
import { HomeStackParamList } from "~/navigation/HomeStackNavigator";
import { api } from "~/utils/api";
import { showToast } from "~/utils/showToast";

export function InfoTabContent() {
  return (
    <Suspense fallback={<CenteredActivityIndicator size="large" />}>
      <Resolved />
    </Suspense>
  );
}

function Resolved() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const {
    params: { storeId },
  } = useRoute<RouteProp<HomeStackParamList, "StoreDetailScreen">>();
  const { data: store } = api.store.findById.useQuery(storeId);

  if (store == null) {
    throw new Error("상점 정보를 불러오지 못했습니다.");
  }

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 48,
      }}
    >
      <YStack gap={8}>
        <XStack gap={8}>
          <View className="mt-0.5">
            <Ionicons name="time-outline" size={20} color={colors.gray900} />
          </View>
          <View>
            {store.businessDays.length > 0 ? (
              BusinessDay.sort(store.businessDays).map((businessDay) => {
                return (
                  <Text
                    key={businessDay.dayOfWeek}
                    className="text-base text-gray-900"
                  >
                    {BusinessDay.formatBusinessDay(businessDay)}
                  </Text>
                );
              })
            ) : (
              <Text className="text-base text-gray-900">가게 문의</Text>
            )}
          </View>
        </XStack>
        <XStack gap={8} className="items-center">
          <Ionicons name="call-outline" size={20} color={colors.gray900} />
          <Text className="text-base text-gray-900">{store.phoneNumber}</Text>
        </XStack>
        {store.description != null ? (
          <XStack gap={8}>
            <View className="mt-0.5">
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.gray900}
              />
            </View>
            <Text className="flex-1 text-base text-gray-900">
              {store.description}
            </Text>
          </XStack>
        ) : null}
        <XStack gap={8}>
          <View className="mt-0.5">
            <Ionicons name="map-outline" size={20} color={colors.gray900} />
          </View>
          <YStack gap={8} className="flex-1">
            <TouchableOpacity
              onPress={async () => {
                await setStringAsync(store.address);

                if (Platform.OS !== "android") {
                  showToast("주소를 복사했어요.");
                }
              }}
            >
              <Text className="flex-1 text-base text-gray-900">
                {store.address + " "}
                <Ionicons
                  name="copy-outline"
                  size={18}
                  color={colors.blue500}
                />
              </Text>
            </TouchableOpacity>
            <View className="h-40">
              <MapView
                onPress={() => {
                  navigation.navigate("MarkedMapScreen", {
                    latitude: store.latitude,
                    longitude: store.longitude,
                  });
                }}
                className="w-full flex-1"
                provider={PROVIDER_GOOGLE}
                userLocationPriority="balanced"
                showsUserLocation={true}
                initialCamera={{
                  center: {
                    latitude: store.latitude,
                    longitude: store.longitude,
                  },
                  heading: 0,
                  pitch: 0,
                  zoom: 15,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                showsMyLocationButton={false}
              >
                <Marker
                  coordinate={{
                    latitude: store.latitude,
                    longitude: store.longitude,
                  }}
                />
              </MapView>
              <TouchableWithoutFeedback className="absolute bottom-0 right-0 mb-2 mr-2">
                <View className="bg-background rounded p-1 shadow">
                  <Text className="text-xs">지도 크게 보기</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </YStack>
        </XStack>
      </YStack>
    </ScrollView>
  );
}
