import { ReactNode } from "react";
import { Button, Text, View } from "react-native";

interface Props {
  confirmButton: ReactNode;
}

export function Emtpy({ confirmButton }: Props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignSelf: "center",
      }}
    >
      <View
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
          }}
        >
          주변에 카페가 없어요.
        </Text>
        {confirmButton}
      </View>
    </View>
  );
}
