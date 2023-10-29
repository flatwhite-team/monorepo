import { View, Text } from "react-native";
import { styles } from "../../../styles/commonStyle";

export function ContactScreen() {
  return (
    <View
      style={{
        ...styles.container,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
        }}
      >
        flatwhiteapp@gmail.com
      </Text>
    </View>
  );
}
