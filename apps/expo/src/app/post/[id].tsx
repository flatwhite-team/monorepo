import { SafeAreaView, Text, View } from "react-native";
import { Stack, useGlobalSearchParams } from "expo-router";

export default function Post() {
  const { id } = useGlobalSearchParams();
  if (!id || typeof id !== "string") throw new Error("unreachable");

  return (
    <SafeAreaView className="bg-[#1F104A]">
      <Stack.Screen options={{ title: "title" }} />
      <View className="h-full w-full p-4">
        <Text className="py-2 text-3xl font-bold text-white">title</Text>
        <Text className="py-4 text-white">content</Text>
      </View>
    </SafeAreaView>
  );
}
