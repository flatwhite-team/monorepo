import { View, Text, StyleSheet } from "react-native";
import { BusinessDay } from "../../../models/BusinessDay";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useStore } from "../../../hooks/useStore";
import { HomeStackParamList } from "../../../navigation/HomeStackNavigator";

export function InfoTabContent() {
  const {
    params: { storeId },
  } = useRoute<RouteProp<HomeStackParamList, "StoreDetailScreen">>();
  const { data: store } = useStore(storeId);

  if (store == null) {
    throw new Error("상점 정보를 불러오지 못했습니다.");
  }

  return (
    <View style={Style.storeInfoSection}>
      <View style={Style.infoText}>
        {store.businessDays.length > 0 ? (
          BusinessDay.sort(store.businessDays).map((businessDay) => {
            return (
              <Text key={businessDay.dayOfWeek} style={Style.subText}>
                {BusinessDay.formatBusinessDay(businessDay)}
              </Text>
            );
          })
        ) : (
          <Text style={Style.subText}>가게 문의</Text>
        )}
      </View>
      <View style={Style.infoText}>
        <Text style={Style.subText}>{store.tel}</Text>
      </View>
    </View>
  );
}

const Style = StyleSheet.create({
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
  subText: {
    fontSize: 16,
  },
});
