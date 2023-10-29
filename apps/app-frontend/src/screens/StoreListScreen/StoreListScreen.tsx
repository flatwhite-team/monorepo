import { Suspense, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";

import { styles } from "../../../styles/commonStyle";
import { CenteredActivityIndicator } from "../../components/CenteredActivityIndicator";
import { DEFAULT_COORDS, DEFAULT_RADIUS } from "../../constants";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { useLocationPermissionStatus } from "../../hooks/useLocationPermissionStatus";
import { Emtpy } from "./components/Empty";
import { Header } from "./components/Header";
import StoreItem from "./components/StoreItem";
import { useInfiniteStores } from "./hooks/useInfiniteStores";

export function StoreListScreen() {
  const inset = useSafeAreaInsets();

  return (
    <View
      style={{
        ...ListStyle.container,
        paddingTop: inset.top,
      }}
    >
      <Header />
      <Suspense fallback={<CenteredActivityIndicator size="large" />}>
        <Resolved />
      </Suspense>
    </View>
  );
}

function Resolved() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [shouldUseFallbackLocation, setShouldUseFallbackLocation] =
    useState(false);
  const { data: locationPermissionStatus } = useLocationPermissionStatus();
  const { data: currentLocation } = useCurrentLocation({
    shouldUseFallbackLocation:
      shouldUseFallbackLocation || !locationPermissionStatus?.granted,
  });
  const latitude = currentLocation?.coords.latitude ?? DEFAULT_COORDS.latitude;
  const longitude =
    currentLocation?.coords.longitude ?? DEFAULT_COORDS.longitude;
  const radius = DEFAULT_RADIUS;
  const pageSize = DEFAULT_STORE_LIST_PAGINATION_SIZE;
  const {
    data: infiniteStoresData,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteStores({
    locationOptions: {
      latitude,
      longitude,
      radius,
    },
    take: pageSize,
  });

  if (infiniteStoresData == null) {
    throw new Error("상점 정보를 불러오지 못했습니다.");
  }

  // @ts-ignore: trpc useInfiniteQuery 타입이 틀림
  const stores = infiniteStoresData.pages.flat();

  if (stores.length === 0) {
    return (
      <Emtpy
        onConfirm={() => {
          setShouldUseFallbackLocation(true);
        }}
      />
    );
  }

  return (
    <FlatList
      style={ListStyle.flatList}
      data={stores}
      renderItem={({ item }) => {
        return <StoreItem data={item} />;
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
          onRefresh={() => {
            setRefreshing(true);
            setTimeout(() => {
              setRefreshing(false);
            }, 500);

            if (shouldUseFallbackLocation) {
              setShouldUseFallbackLocation(false);
            }

            queryClient.removeQueries({
              queryKey: [useCurrentLocation.baseQueryKey],
            });
            queryClient.removeQueries({
              queryKey: [useInfiniteStores.baseQueryKey],
            });
          }}
        />
      }
    />
  );
}

const ListStyle = StyleSheet.create({
  container: {
    ...styles.container,
    alignItems: "flex-start",
  },
  flatList: {
    width: "100%",
  },
});

const DEFAULT_STORE_LIST_PAGINATION_SIZE = 10;
