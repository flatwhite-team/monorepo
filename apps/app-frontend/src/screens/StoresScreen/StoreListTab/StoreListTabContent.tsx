import { RefObject, Suspense, useState } from "react";
import { Animated, RefreshControl, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { JoinedStore } from "@flatwhite-team/trpc-server/src/router/store";
import BottomSheet from "@gorhom/bottom-sheet";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { useQueryClient } from "@tanstack/react-query";

import { CenteredActivityIndicator } from "~/components/CenteredActivityIndicator";
import { colors, DEFAULT_RADIUS } from "~/constants";
import { HomeStackParamList } from "~/navigation/HomeStackNavigator";
import { useCustomLocation } from "~/providers/CustomLocationProvider";
import { FiltersScrollView } from "../components/FiltersScrollView";
import { StoreItem } from "../components/StoreItem";
import { Emtpy } from "./components/Empty";
import { useInfiniteStores } from "./hooks/useInfiniteStores";

const FILTERS_SCROLL_VIEW_HEIGHT = 62;
const DIFF_CLAMP_MAX = FILTERS_SCROLL_VIEW_HEIGHT + 40;

interface Props {
  storeListRef: RefObject<FlashList<JoinedStore>>;
  filterBottomSheetRef: RefObject<BottomSheet>;
}

export function StoreListTabContent({
  storeListRef,
  filterBottomSheetRef,
}: Props) {
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, DIFF_CLAMP_MAX);

  return (
    <View className="flex-1">
      <Animated.View
        className="bg-background absolute z-10 w-full py-4"
        style={{
          transform: [
            {
              translateY: diffClamp.interpolate({
                inputRange: [0, DIFF_CLAMP_MAX],
                outputRange: [0, -DIFF_CLAMP_MAX],
              }),
            },
          ],
        }}
      >
        <FiltersScrollView bottomSheetRef={filterBottomSheetRef} />
      </Animated.View>
      <Suspense fallback={<CenteredActivityIndicator size="large" />}>
        <Resolved storeListRef={storeListRef} scrollY={scrollY} />
      </Suspense>
    </View>
  );
}

interface ResolvedProps {
  storeListRef: RefObject<FlashList<JoinedStore>>;
  scrollY: Animated.Value;
}

function Resolved({ storeListRef, scrollY }: ResolvedProps) {
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
    isFetchingNextPage,
  } = useInfiniteStores({
    locationOptions: {
      latitude: location.latitude,
      longitude: location.longitude,
      radius,
    },
    filters: Object.values(filters ?? {}).filter((filterGroup) => {
      return filterGroup.length > 0;
    }),
    take: pageSize,
  });

  if (infiniteStoresData == null) {
    throw new Error("상점 정보를 불러오지 못했습니다.");
  }

  const stores = infiniteStoresData.pages.flat();

  return (
    <>
      {stores.length === 0 ? (
        <Emtpy className={`mt-[${FILTERS_SCROLL_VIEW_HEIGHT}px]`} />
      ) : (
        <FlashList
          ref={storeListRef}
          className="w-full"
          contentContainerStyle={{
            paddingTop: FILTERS_SCROLL_VIEW_HEIGHT - 14,
          }}
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
          estimatedItemSize={120}
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
          onScroll={({
            nativeEvent: {
              contentOffset: { y: contentOffsetY },
              contentSize: { height: contentSizeHeight },
              layoutMeasurement: { height: layoutMeasurementHeight },
            },
          }) => {
            if (
              contentOffsetY < 0 ||
              contentOffsetY > contentSizeHeight - layoutMeasurementHeight
            ) {
              return;
            }

            scrollY.setValue(contentOffsetY);
          }}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View>
                <CenteredActivityIndicator size="small" />
              </View>
            ) : null
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
