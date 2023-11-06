import { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { JoinedStore } from "@flatwhite-team/trpc-server/src/router/store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import isEqual from "lodash/isEqual";

import { BusinessDay } from "../../../models/BusinessDay";
import { HomeStackParamList } from "../../../navigation/HomeStackNavigator";

const logoImage = require("../../../images/icon.png");

type StoreItemNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "StoreDetailScreen"
>;

interface Props {
  data: JoinedStore;
}

function StoreItem({ data: { id, name, images, menus, businessDays } }: Props) {
  const navigation = useNavigation<StoreItemNavigationProp>();
  const currentBusinessDay = BusinessDay.getCurrentBusinessDay(businessDays);

  return (
    <TouchableOpacity
      className="max-h-32 flex-1 flex-row border-b border-gray-100 p-5"
      onPress={() => navigation.navigate("StoreDetailScreen", { storeId: id })}
    >
      <Image
        className="h-20 w-20 rounded-lg object-cover"
        source={images.length > 0 ? { uri: images[0].url } : logoImage}
      />
      <View className="ml-5 flex-1 flex-col">
        <Text className="text-xl font-semibold text-black" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-base" numberOfLines={1}>
          {currentBusinessDay != null
            ? BusinessDay.formatBusinessHours(currentBusinessDay)
            : "가게 문의"}
        </Text>
        {menus.length > 0 ? (
          <Text className="text-base text-gray-400" numberOfLines={1}>
            {menus.map((menu) => menu.name).join(", ")}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default memo(StoreItem, isEqual);
