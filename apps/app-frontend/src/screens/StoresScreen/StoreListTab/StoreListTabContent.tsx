import { Suspense, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

import { CenteredActivityIndicator } from "~/components/CenteredActivityIndicator";
import { colors, DEFAULT_COORDS, DEFAULT_RADIUS } from "~/constants";
import { useCurrentLocation } from "~/hooks/useCurrentLocation";
import { useLocationPermissionStatus } from "~/hooks/useLocationPermissionStatus";
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

const DEFAULT_STORE_LIST_PAGINATION_SIZE = 10;
