import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { JoinedStore } from "@flatwhite-team/trpc-server/src/router/store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { colors } from "../../../constants";
import { BusinessDay } from "../../../models/BusinessDay";
import { HomeStackParamList } from "../../../navigation/HomeStackNavigator";

type StoreItemNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "StoreDetailScreen"
>;

interface Props {
  data: JoinedStore;
  style?: ViewStyle;
}

export function StoreItem({
  data: { id, name, images, menus, businessDays },
  style,
}: Props) {
  const { navigate } = useNavigation<StoreItemNavigationProp>();
  const currentBusinessDay = BusinessDay.getCurrentBusinessDay(businessDays);

  return (
    <TouchableOpacity
      style={{ ...StoreItemStyle.container, ...style }}
      onPress={() => navigate("StoreDetailScreen", { storeId: id })}
    >
      <Image
        style={StoreItemStyle.image}
        source={
          images.length > 0
            ? { uri: images[0].url }
            : require("../../../images/icon.png")
        }
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

StoreItem.maxHeight = 120;

const StoreItemStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    maxHeight: StoreItem.maxHeight,
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
    color: colors.gray500,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    marginRight: 20,
    borderRadius: 4,
  },
});
