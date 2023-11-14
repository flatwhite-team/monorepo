import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { colors } from "~/constants";
import { StoresTabView } from "./StoresTabView";

export function StoresScreen() {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  console.log(navigation.getId(), navigation.getState());

  return (
    <View
      style={{
        ...Style.wrapper,
        paddingTop: inset.top,
      }}
    >
      <StoresTabView />
    </View>
  );
}

const Style = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
