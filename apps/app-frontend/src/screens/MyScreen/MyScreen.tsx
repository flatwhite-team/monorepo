import { Alert, Linking, Platform, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { setStringAsync } from "expo-clipboard";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { colors, EMAIL } from "~/constants";
import { HomeStackNavigationProp } from "~/navigation/HomeStackNavigator";
import { showToast } from "~/utils/showToast";
import { ListRow } from "./ListRow";

export function MyScreen() {
  return (
    <ScrollView className="bg-background flex-1">
      <RequestListRow />
      <BizListRow />
      <ContactListRow />
      <VersionListRow />
    </ScrollView>
  );
}

function RequestListRow() {
  const navigation = useNavigation<HomeStackNavigationProp>();

  return (
    <ListRow
      onPress={() => {
        navigation.navigate("RequestScreen");
      }}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base">지역 / 카페 등록 요청</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={colors.gray700}
        />
      </View>
    </ListRow>
  );
}

function BizListRow() {
  const navigation = useNavigation<HomeStackNavigationProp>();

  return (
    <ListRow
      onPress={() => {
        navigation.navigate("BizScreen");
      }}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base">사장님이세요?</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={colors.gray700}
        />
      </View>
    </ListRow>
  );
}

function ContactListRow() {
  return (
    <ListRow
      onPress={() => {
        Alert.alert(
          "메일 앱을 열까요?",
          "문의사항이나 요청사항, 피드백을 보내주세요.",
          [
            {
              text: "취소",
              style: "cancel",
            },
            {
              text: "열기",
              onPress: () =>
                Linking.openURL(`mailto:${EMAIL}`).catch(() => {
                  Alert.alert(
                    "메일 앱을 열 수 없습니다.",
                    "이메일 주소를 복사할까요?",
                    [
                      {
                        text: "취소",
                        style: "cancel",
                      },
                      {
                        text: "복사",
                        onPress: async () => {
                          await setStringAsync(EMAIL);

                          if (Platform.OS !== "android") {
                            showToast("이메일 주소를 복사했어요.");
                          }
                        },
                      },
                    ],
                  );
                }),
            },
          ],
        );
      }}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base">문의</Text>
        <Text className="text-base font-medium">{EMAIL}</Text>
      </View>
    </ListRow>
  );
}

function VersionListRow() {
  return (
    <ListRow>
      <View className="flex-row items-center justify-between">
        <Text className="text-base">버전</Text>
        <Text className="text-base font-medium">
          {Constants.expoConfig?.version}
        </Text>
      </View>
    </ListRow>
  );
}
