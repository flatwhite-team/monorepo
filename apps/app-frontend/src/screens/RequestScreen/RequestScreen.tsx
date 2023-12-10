import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { YStack } from "tamagui";

import { HomeStackNavigationProp } from "~/navigation/HomeStackNavigator";
import { sendSlackNotibotMessage } from "~/utils/sendSlackNotibotMessage";
import { showToast } from "~/utils/showToast";

export function RequestScreen() {
  const navigation = useNavigation<HomeStackNavigationProp>();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      requestValue: "",
    },
  });

  return (
    <KeyboardAvoidingView
      className="bg-background w-full flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <YStack
        gap={8}
        className="flex-1 justify-center p-5"
        onPress={Keyboard.dismiss}
      >
        <Text className="text-xl">
          {`지역이나 카페 이름을 적어주세요.\n빠르게 카페를 등록할게요.`}
        </Text>
        <Controller
          control={control}
          name="requestValue"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`rounded border ${
                errors.requestValue == null
                  ? "border-gray-300"
                  : "border-red-500"
              } px-4 py-3`}
              placeholder="예) 성수동, 강남역, 스타벅스"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <Button
          title="요청하기"
          onPress={handleSubmit(async ({ requestValue }) => {
            Keyboard.dismiss();
            await sendSlackNotibotMessage(
              `[지역 / 카페 등록 요청] ${requestValue}`,
            );
            showToast(`${requestValue} 카페 등록을 요청했어요.`);
            navigation.pop();
          })}
          disabled={isSubmitting}
        />
      </YStack>
    </KeyboardAvoidingView>
  );
}
