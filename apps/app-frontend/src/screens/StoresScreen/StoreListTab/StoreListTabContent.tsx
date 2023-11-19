import { Suspense, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";

import { CenteredActivityIndicator } from "~/components/CenteredActivityIndicator";
import { colors, DEFAULT_RADIUS } from "~/constants";
import { HomeStackParamList } from "~/navigation/HomeStackNavigator";
import { useCustomLocation } from "~/providers/CustomLocationProvider";
import { FiltersScrollView } from "../components/FiltersScrollView";
import { StoreItem } from "../components/StoreItem";
import { Emtpy } from "./components/Empty";
import { useInfiniteStores } from "./hooks/useInfiniteStores";

export function StoreListTabContent() {
  return (
    <Suspense fallback={<CenteredActivityIndicator size="large" />}>
      <Resolved />
    </Suspense>
  );
}

function Resolved() {
  const {
    params: { filters },
  } = useRoute<RouteProp<HomeStackParamList, "StoresScreen">>();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { location, initializeLocation } = useCustomLocation();
  const radius = DEFAULT_RADIUS;
  const pageSize = DEFAULT_STORE_LIST_PAGINATION_SIZE;
  const {
    data: infiniteStoresData,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteStores({
    locationOptions: {
      latitude: location.latitude,
      longitude: location.longitude,
      radius,
    },
    characteristics: Array.from(filters.values()),
    take: pageSize,
  });

  if (infiniteStoresData == null) {
    throw new Error("상점 정보를 불러오지 못했습니다.");
  }

  const stores = infiniteStoresData.pages.flat();

  return (
    <View className="flex-1">
      <FiltersScrollView />
      {stores.length === 0 ? (
        <Emtpy />
      ) : (
        <FlatList
          className="w-full pt-1"
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
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage({
                cancelRefetch: false,
              });
            }
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                setTimeout(() => {
                  setRefreshing(false);
                }, 500);

                await initializeLocation();

                queryClient.refetchQueries({
                  queryKey: [useInfiniteStores.baseQueryKey],
                });
              }}
            />
          }
        />
      )}
      <CustomLocationButton />
    </View>
  );
}

function CustomLocationButton() {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  return (
    <TouchableOpacity
      className="bg-primary absolute bottom-4 right-4 rounded-full p-3"
      onPress={() => {
        navigate("CustomLocationScreen");
      }}
    >
      <Ionicons name="map-outline" size={24} color={colors.gray100} />
    </TouchableOpacity>
  );
}

const DEFAULT_STORE_LIST_PAGINATION_SIZE = 10;
