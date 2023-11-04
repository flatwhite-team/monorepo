import { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { JoinedStore } from "@flatwhite-team/trpc-server/src/router/store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import isEqual from "lodash/isEqual";

import { colors } from "../../../constants";
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
      style={StoreItemStyle.container}
      onPress={() => navigation.navigate("StoreDetailScreen", { storeId: id })}
    >
      <Image
        style={StoreItemStyle.image}
        source={images.length > 0 ? { uri: images[0].url } : logoImage}
      />
      <View style={StoreItemStyle.info}>
        <Text style={StoreItemStyle.title} numberOfLines={1}>
          {name}
        </Text>
        <Text style={StoreItemStyle.businessHours} numberOfLines={1}>
          {currentBusinessDay != null
            ? BusinessDay.formatBusinessHours(currentBusinessDay)
            : "가게 문의"}
        </Text>
        {menus.length > 0 ? (
          <Text style={StoreItemStyle.menu} numberOfLines={1}>
            {menus.map((menu) => menu.name).join(", ")}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const StoreItemStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 120,
    borderBottomColor: colors.gray100,
    borderBottomWidth: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  info: {
    flex: 1,
    flexDirection: "column",
    gap: 4,
  },
  businessHours: {
    fontSize: 16,
  },
  menu: {
    fontSize: 16,
    color: colors.gray,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    marginRight: 20,
    borderRadius: 10,
  },
});

export default memo(StoreItem, isEqual);
