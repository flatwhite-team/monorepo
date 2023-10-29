import { StyleSheet } from "react-native";
import { Text, View, Image } from "react-native";
import { memo } from "react";
import isEqual from "lodash/isEqual";
import { Menu } from "../../../models/Menu";
import { colors } from "../../../constants";

const tempMenuImage = require("../../../images/icon.png");

function MenuItem({ id, name, price, description, images }: Menu) {
  return (
    <View key={id} style={MenuItemStyle.container}>
      <Image
        style={MenuItemStyle.image}
        source={images.length > 0 ? { uri: images[0].url } : tempMenuImage}
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
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 10,
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
    color: colors.gray,
  },
  price: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default memo(MenuItem, isEqual);
