import { Suspense, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";

import { CenteredActivityIndicator } from "~/components/CenteredActivityIndicator";
import { colors, DEFAULT_COORDS, DEFAULT_RADIUS } from "~/constants";
import { HomeStackParamList } from "~/navigation/HomeStackNavigator";
import { useCustomLocation } from "~/providers/CustomLocationProvider";
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
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { location, setLocation, initializeLocation } = useCustomLocation();
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
    take: pageSize,
  });

  if (infiniteStoresData == null) {
    throw new Error("상점 정보를 불러오지 못했습니다.");
  }

  const stores = infiniteStoresData.pages.flat();

  return (
    <>
      {stores.length === 0 ? (
        <Emtpy
          onConfirm={() => {
            setLocation({
              latitude: DEFAULT_COORDS.latitude,
              longitude: DEFAULT_COORDS.longitude,
            });
          }}
        />
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
    </>
  );
}

function CustomLocationButton() {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  return (
    <TouchableOpacity
      className="bg-primary absolute bottom-5 right-5 rounded-full p-3"
      onPress={() => {
        navigate("CustomLocationScreen");
      }}
    >
      <Ionicons name="map-outline" size={24} color={colors.gray100} />
    </TouchableOpacity>
  );
}

const DEFAULT_STORE_LIST_PAGINATION_SIZE = 10;
