import { ComponentProps } from "react";
import { Text, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { colors } from "~/constants";
import { HomeStackParamList } from "~/navigation/HomeStackNavigator";

export function MyScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  return (
    <View className="bg-background flex-1">
      <ListRow
        onPress={() => {
          navigation.navigate("AuthScreen");
        }}
      >
        <Text className="text-base font-medium">로그인</Text>
      </ListRow>
      <ListRow>
        <View className="flex-row justify-between">
          <Text className="text-base font-medium">문의</Text>
          <Text className="text-base font-medium">flatwhiteapp@gmail.com</Text>
        </View>
      </ListRow>
      <ListRow>
        <View className="flex-row justify-between">
          <Text className="text-base font-medium">버전</Text>
          <Text className="text-base font-medium">
            {Constants.expoConfig?.version}
          </Text>
        </View>
      </ListRow>
    </View>
  );
}

interface ListRowProps extends ComponentProps<typeof View> {
  onPress?: () => void;
}

function ListRow({ onPress, ...props }: ListRowProps) {
  const className = "border-b border-gray-200 p-4";

  return onPress != null ? (
    <TouchableHighlight underlayColor={colors.gray100} onPress={onPress}>
      <View className={className} {...props} />
    </TouchableHighlight>
  ) : (
    <View className={className} {...props} />
  );
}
