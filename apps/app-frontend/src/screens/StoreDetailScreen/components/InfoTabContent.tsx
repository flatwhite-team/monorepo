import { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";

import { BusinessDay } from "../../../models/BusinessDay";
import { HomeStackParamList } from "../../../navigation/HomeStackNavigator";
import { api } from "../../../utils/api";

export function InfoTabContent() {
  const {
    params: { storeId },
  } = useRoute<RouteProp<HomeStackParamList, "StoreDetailScreen">>();
  const { data: store } = api.store.findById.useQuery(storeId);

  if (store == null) {
    throw new Error("상점 정보를 불러오지 못했습니다.");
  }

  return (
    <ScrollView className="mb-5 flex flex-1 flex-col pt-5">
      <View className="mb-2 flex flex-row gap-x-2">
        <View className="mt-0.5">
          <Ionicons name="time-outline" size={20} />
        </View>
        <View>
          {store.businessDays.length > 0 ? (
            BusinessDay.sort(store.businessDays).map((businessDay) => {
              return (
                <Text key={businessDay.dayOfWeek} className="text-base">
                  {BusinessDay.formatBusinessDay(businessDay)}
                </Text>
              );
            })
          ) : (
            <Text className="text-base">가게 문의</Text>
          )}
        </View>
      </View>
      <ContentWrapper>
        <Ionicons name="call-outline" size={20} />
        <Text className="text-base">{store.phoneNumber}</Text>
      </ContentWrapper>
      <ContentWrapper>
        <Ionicons name="map-outline" size={20} />
        <Text className="text-base">{store.address}</Text>
      </ContentWrapper>
      <View className="mb-5 flex flex-row gap-x-2">
        <View className="mt-0.5">
          <Ionicons name="information-circle-outline" size={20} />
        </View>
        <Text className="flex-1 text-base">{`${store.description}${store.description}`}</Text>
      </View>
    </ScrollView>
  );
}

function ContentWrapper({ children }: { children: ReactNode }) {
  return (
    <View className="not-last:mb-0 mb-2 flex flex-row items-center gap-x-2">
      {children}
    </View>
  );
}
