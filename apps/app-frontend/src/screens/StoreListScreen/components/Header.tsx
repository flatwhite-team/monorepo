import { View, Text, Image } from "react-native";

const appIcon = require("../../../images/appIcon.png");

export function Header() {
  return (
    <View>
      <View
        style={{
          paddingTop: 36,
          paddingLeft: 20,
        }}
      >
        <Image
          source={appIcon}
          style={{
            width: 140,
            height: 26,
            resizeMode: "cover",
          }}
        />
      </View>
      <Text
        style={{
          paddingTop: 36,
          paddingLeft: 20,
          marginBottom: 20,
          fontSize: 18,
          fontWeight: "300",
        }}
      >
        내 주변 카페
      </Text>
    </View>
  );
}
