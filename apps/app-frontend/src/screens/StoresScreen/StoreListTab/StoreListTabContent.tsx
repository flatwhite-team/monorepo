import { Suspense, useState } from "react";
import {
  Animated,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
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

const FILTERS_SCROLL_VIEW_HEIGHT = 62;

export function StoreListTabContent() {
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, FILTERS_SCROLL_VIEW_HEIGHT);

  return (
    <View className="flex-1">
      <Animated.View
        style={{
          position: "absolute",
          backgroundColor: colors.background,
          transform: [
            {
              translateY: diffClamp.interpolate({
                inputRange: [0, FILTERS_SCROLL_VIEW_HEIGHT],
                outputRange: [0, -FILTERS_SCROLL_VIEW_HEIGHT],
              }),
            },
          ],
          zIndex: 1,
        }}
      >
        <FiltersScrollView className="my-4" />
      </Animated.View>
      <Suspense fallback={<CenteredActivityIndicator size="large" />}>
        <Resolved scrollY={scrollY} />
      </Suspense>
    </View>
  );
}

interface Props {
  scrollY: Animated.Value;
}

function Resolved({ scrollY }: Props) {
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
    <>
      {stores.length === 0 ? (
        <Emtpy />
      ) : (
        <FlatList
          className="w-full pt-12"
          data={stores}
          renderItem={({ item }) => {
            return (
              <StoreItem
                data={item}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: colors.gray100,
                  marginBottom:
                    item.id === stores[stores.length - 1].id ? 48 : 0,
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
