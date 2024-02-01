import { ComponentProps, useEffect } from "react";
import { Button, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";

import { DEFAULT_COORDS } from "~/constants";
import { HomeTabRouteProp } from "~/navigation/RootTabNavigator";
import { useCustomLocation } from "~/providers/CustomLocationProvider";
import { sendSlackNotibotMessage } from "~/utils/sendSlackNotibotMessage";
import { useStoresScreenNavigation } from "../../hooks/useStoresScreenNavigation";

interface Props extends ComponentProps<typeof View> {}

export function Emtpy(props: Props) {
  const navigation = useStoresScreenNavigation();
  const {
    params: { filters },
  } = useRoute<HomeTabRouteProp>();
  const { location, setLocation } = useCustomLocation();
  const filtered = filters != null && Object.values(filters).length > 0;

  useEffect(() => {
    sendSlackNotibotMessage(`[미등록 지역] ${JSON.stringify(location)}`);
  }, []);

  return (
    <View className="flex-1 justify-center self-center" {...props}>
      <Text className="text-xl">주변에 카페가 없어요.</Text>
      <Button
        title={filtered ? "필터 제거" : "강남역 주변 카페 보기"}
        onPress={() => {
          if (filtered) {
            navigation.resetFilters();
          } else {
            setLocation({
              latitude: DEFAULT_COORDS.latitude,
              longitude: DEFAULT_COORDS.longitude,
            });
          }
        }}
      />
    </View>
  );
}
