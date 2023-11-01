import { ReactNode } from "react";
import { Text, View } from "react-native";
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
    <View className="my-5 flex flex-col">
      <View className="mb-2 flex flex-row gap-x-2">
        <View className="mt-0.5">
          <Ionicons name="time-outline" size={18} />
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
        <Ionicons name="call-outline" size={18} />
        <Text className="text-base">{store.tel}</Text>
      </ContentWrapper>
      <ContentWrapper>
        <Ionicons name="map-outline" size={18} />
        <Text className="text-base">{store.address}</Text>
      </ContentWrapper>
    </View>
  );
}

function ContentWrapper({ children }: { children: ReactNode }) {
  return (
    <View className="not-last:mb-0 mb-2 flex flex-row items-center gap-x-2">
      {children}
    </View>
  );
}
