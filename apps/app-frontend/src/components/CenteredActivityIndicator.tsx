import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";

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
