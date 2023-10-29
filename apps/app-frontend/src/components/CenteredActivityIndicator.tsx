import { View, ActivityIndicator, ActivityIndicatorProps } from "react-native";

export function CenteredActivityIndicator(props: ActivityIndicatorProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignSelf: "center",
      }}
    >
      <ActivityIndicator {...props} />
    </View>
  );
}
