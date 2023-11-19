import { ComponentProps } from "react";
import { Button, Text, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { DEFAULT_COORDS } from "~/constants";
import { HomeStackParamList } from "~/navigation/HomeStackNavigator";
import { useCustomLocation } from "~/providers/CustomLocationProvider";

interface Props extends ComponentProps<typeof View> {}

export function Emtpy(props: Props) {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<HomeStackParamList, "StoresScreen">
    >();
  const {
    params: { filters },
  } = useRoute<RouteProp<HomeStackParamList, "StoresScreen">>();
  const { setLocation } = useCustomLocation();
  const filtered = filters.length > 0;
  const confirmButtonTitle = filtered ? "필터 제거" : "강남역 주변 카페 보기";

  function handleConfirm() {
    if (filtered) {
      navigation.setParams({
        filters: [],
      });
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
