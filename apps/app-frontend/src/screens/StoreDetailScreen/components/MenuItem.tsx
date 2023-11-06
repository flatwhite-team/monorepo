import { memo } from "react";
import { Image, Text, View } from "react-native";
import { Image as ImageModel, Menu } from "@flatwhite-team/prisma";
import isEqual from "lodash/isEqual";

const tempMenuImage = require("../../../images/icon.png");

interface MenuProps extends Menu {
  images: Pick<ImageModel, "url">[];
}

function MenuItem({ id, name, price, description, images }: MenuProps) {
  return (
    <View key={id} className="flex-1 flex-row border-b border-gray-100 py-5">
      <Image
        className="h-20 w-20 rounded-lg object-cover"
        source={images.length > 0 ? { uri: images[0].url } : tempMenuImage}
      />
      <View className="ml-5 flex-1 flex-col">
        <View>
          <Text className="text-lg font-semibold">{name}</Text>
          {description != null ? (
            <Text
              className="text-base text-gray-400"
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {description}
            </Text>
          ) : null}
          {price != null ? (
            <Text className="text-primary text-base font-semibold">
              {`${price.toLocaleString()}원`}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default memo(MenuItem, isEqual);
