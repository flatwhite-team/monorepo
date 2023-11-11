import { Image, View } from "react-native";

export function Header() {
  return (
    <View className="my-4 ml-5">
      <Image
        source={require("./appIcon.png")}
        style={{
          width: 140,
          height: 26,
          resizeMode: "cover",
        }}
      />
    </View>
  );
}
