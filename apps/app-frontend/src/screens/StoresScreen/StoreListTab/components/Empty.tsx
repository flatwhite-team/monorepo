import { ComponentProps } from "react";
import { Button, Text, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import { DEFAULT_COORDS } from "~/constants";
import { StoresScreenRouteProp } from "~/navigation/HomeStackNavigator";
import { useCustomLocation } from "~/providers/CustomLocationProvider";
import { useStoresScreenNavigation } from "../../hooks/useStoresScreenNavigation";

interface Props extends ComponentProps<typeof View> {}

export function Emtpy(props: Props) {
  const navigation = useStoresScreenNavigation();
  const {
    params: { filters },
  } = useRoute<StoresScreenRouteProp>();
  const { setLocation } = useCustomLocation();
  const filtered = filters != null && Object.values(filters).length > 0;
  const confirmButtonTitle = filtered ? "필터 제거" : "강남역 주변 카페 보기";

  function handleConfirm() {
    if (filtered) {
      navigation.resetFilters();
    } else {
      setLocation({
        latitude: DEFAULT_COORDS.latitude,
        longitude: DEFAULT_COORDS.longitude,
      });
    }
  }

  return (
    <View className="flex-1 justify-center self-center" {...props}>
      <Text className="text-xl">주변에 카페가 없어요.</Text>
      <Button title={confirmButtonTitle} onPress={handleConfirm} />
    </View>
  );
}
