import { View, Text, Button } from "react-native";

interface Props {
  onConfirm: () => void;
}

export function Emtpy({ onConfirm }: Props) {
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
        <Button title="강남역 주변 카페 보기" onPress={onConfirm} />
      </View>
    </View>
  );
}
