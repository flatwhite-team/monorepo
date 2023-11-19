import { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Characteristic } from "@flatwhite-team/prisma";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { XStack } from "tamagui";

import { HomeStackParamList } from "~/navigation/HomeStackNavigator";

interface Props extends ComponentProps<typeof View> {}

export function FiltersScrollView(props: Props) {
  return (
    <View {...props}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        className="px-4"
      >
        <XStack space={4} className="mr-8">
          {Object.keys(필터).map((characteristic) => {
            return (
              <Badge
                key={characteristic}
                characteristic={characteristic as Characteristic}
              />
            );
          })}
        </XStack>
      </ScrollView>
    </View>
  );
}

interface BadgeProps {
  characteristic: Characteristic;
}

function Badge({ characteristic }: BadgeProps) {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<HomeStackParamList, "StoresScreen">
    >();
  const {
    params: { filters },
  } = useRoute<RouteProp<HomeStackParamList, "StoresScreen">>();
  const active = filters.includes(characteristic);

  return (
    <Pressable
      onPress={() => {
        const newParams = active
          ? filters.filter((filter) => {
              return filter !== characteristic;
            })
          : [...filters, characteristic];

        navigation.setParams({
          filters: newParams,
        });
      }}
    >
      <View
        className={`bg-background rounded-full border px-3 py-1 ${
          active ? "border-primary" : "border-gray-300"
        }`}
      >
        <Text
          className={`text-sm ${
            active ? "text-primary font-bold" : "font-medium text-gray-700"
          }`}
        >
          {필터[characteristic]}
        </Text>
      </View>
    </Pressable>
  );
}

const 필터: Record<Characteristic, string> = {
  SPECIALTY_COFFEE: "스페셜티",
  DECAFFEINATED_COFFEE: "디카페인",
  BAKERY: "베이커리",
  DESSERT: "디저트",
  VEGAN: "비건",
  PET_FRIENDLY: "반려동물",
  ROASTERY: "로스터리",
  WIFI: "와이파이",
  CALM: "차분한",
  QUIET: "조용한",
  TALK: "대화",
  FAMILY: "가족",
  FRIENDS: "친구모임",
  DATE: "데이트",
  WORK: "업무",
  MEETING: "미팅",
  STUDY: "공부",
  OUTDOOR: "야외",
  PARKING: "주차",
  DRIVE_THRU: "드라이브스루",
  OUTLET: "콘센트",
} as const;
