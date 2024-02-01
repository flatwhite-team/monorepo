import { ComponentProps, useEffect, useState } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Toast from "react-native-root-toast";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRoute } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { YStack } from "tamagui";

import { DEFAULT_COORDS } from "~/constants";
import { HomeTabRouteProp } from "~/navigation/RootTabNavigator";
import { useCustomLocation } from "~/providers/CustomLocationProvider";
import { sendSlackNotibotMessage } from "~/utils/sendSlackNotibotMessage";
import { showToast } from "~/utils/showToast";
import { useStoresScreenNavigation } from "../../hooks/useStoresScreenNavigation";

interface Props extends ComponentProps<typeof View> {}

export function Emtpy(props: Props) {
  const tabBarHeight = useBottomTabBarHeight();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      requestValue: "",
    },
  });
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
