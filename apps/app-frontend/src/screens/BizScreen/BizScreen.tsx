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

export function BizScreen() {
  const navigation = useNavigation<HomeStackNavigationProp>();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const errorMessage =
    errors.email == null
      ? undefined
      : errors.email.message != null && errors.email.message !== ""
      ? errors.email.message
      : "이메일을 입력해주세요.";

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
        <Text className="text-xl">{`플랫화이트 카페관리자를 준비 중이에요.\n출시하면 제일 먼저 알려드릴게요.`}</Text>
        <Controller
          control={control}
          name="email"
          rules={{
            required: true,
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "이메일 형식이 올바르지 않습니다.",
            },
          }}
          render={({ field: { onChange, value } }) => {
            return (
              <YStack gap={4}>
                <Text className="text-base">이메일</Text>
                <TextInput
                  className={`rounded border ${
                    errors.email == null ? "border-gray-300" : "border-red-500"
                  } px-4 py-3`}
                  inputMode="email"
                  placeholder="예) flatwhiteapp@gmail.com"
                  value={value}
                  onChangeText={onChange}
                />
                {errorMessage == null ? null : (
                  <Text className="text-sm text-red-500">{errorMessage}</Text>
                )}
              </YStack>
            );
          }}
        />
        <Button
          title="신청하기"
          onPress={handleSubmit(async ({ email }) => {
            Keyboard.dismiss();
            await sendSlackNotibotMessage(`[카페관리 사전신청] ${email}`);
            showToast("카페관리 사전신청을 완료했어요.");
            navigation.pop();
          })}
          disabled={isSubmitting}
        />
      </YStack>
    </KeyboardAvoidingView>
  );
}
