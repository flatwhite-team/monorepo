import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Image as ImageModel, Menu } from "@flatwhite-team/prisma";

import { colors } from "../../../constants";

const tempMenuImage = require("../../../images/icon.png");

interface MenuProps extends Menu {
  images: Pick<ImageModel, "url">[];
}

export function MenuItem({ id, name, price, description, images }: MenuProps) {
  return (
    <View key={id} style={MenuItemStyle.container}>
      <Image
        className="h-20 w-20 rounded"
        source={images.length > 0 ? { uri: images[0].url } : tempMenuImage}
        recyclingKey={id}
      />
      <View style={MenuItemStyle.info}>
        <Text style={MenuItemStyle.title}>{name}</Text>
        {description != null ? (
          <Text
            style={MenuItemStyle.description}
            numberOfLines={1}
            ellipsizeMode={"tail"}
          >
            {description}
          </Text>
        ) : null}
        {price != null ? (
          <Text style={MenuItemStyle.price}>
            {`${price.toLocaleString()}원`}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const MenuItemStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    borderBottomColor: colors.gray100,
    borderBottomWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  info: {
    flexDirection: "column",
    flex: 1,
    gap: 4,
    marginLeft: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    color: colors.gray500,
  },
  price: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
