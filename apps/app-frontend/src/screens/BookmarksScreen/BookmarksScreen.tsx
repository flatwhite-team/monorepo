import { Suspense } from "react";
import { Button, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";

import { CenteredActivityIndicator } from "~/components/CenteredActivityIndicator";
import { colors } from "~/constants";
import { useLocalBookmarkedStoreIds } from "~/hooks/useLocalBookmarkedStoreIds";
import { HomeTabNavigationProp } from "~/navigation/RootTabNavigator";
import { api } from "~/utils/api";
import { StoreItem } from "../../components/StoreItem";

export function BookmarksScreen() {
  return (
    <View className="bg-background flex-1">
      <Suspense fallback={<CenteredActivityIndicator size="large" />}>
        <Resolved />
      </Suspense>
    </View>
  );
}

function Resolved() {
  const navigation = useNavigation<HomeTabNavigationProp>();
  const { data: bookmarks } = useLocalBookmarkedStoreIds();
  const { data: stores } = api.store.findByIds.useQuery(bookmarks ?? []);

  if (stores == null) {
    throw new Error("상점 정보를 불러오지 못했습니다.");
  }

  return stores.length === 0 ? (
    <View className="flex-1 justify-center self-center">
      <Text className="text-xl">찜한 카페가 없어요.</Text>
      <Button
        title="카페 보러 가기"
        onPress={() => {
          navigation.navigate("Home", {
            filters: undefined,
          });
        }}
      />
    </View>
  ) : (
    <FlashList
      estimatedItemSize={120}
      data={stores}
      renderItem={({ item }) => {
        return (
          <StoreItem
            data={item}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.gray100,
            }}
          />
        );
      }}
    />
  );
}
