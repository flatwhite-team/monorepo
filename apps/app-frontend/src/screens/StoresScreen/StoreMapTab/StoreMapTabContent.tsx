import { RefObject, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Store } from "@flatwhite-team/prisma";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRoute } from "@react-navigation/native";
import { debounce } from "lodash";

import { DEFAULT_LATITUDE_DELTA, DEFAULT_LONGITUDE_DELTA } from "~/constants";
import { HomeTabRouteProp } from "~/navigation/RootTabNavigator";
import { useCustomLocation } from "~/providers/CustomLocationProvider";
import { api } from "~/utils/api";
import { StoreItem } from "../../../components/StoreItem";
import { FiltersScrollView } from "../components/FiltersScrollView";

interface Props {
  filterBottomSheetRef: RefObject<BottomSheet>;
}

export function StoreMapTabContent({ filterBottomSheetRef }: Props) {
  const {
    params: { filters },
  } = useRoute<HomeTabRouteProp>();
  const { location } = useCustomLocation();
  const initialRegion = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: DEFAULT_LATITUDE_DELTA,
    longitudeDelta: DEFAULT_LONGITUDE_DELTA,
  };
  const [region, setRegion] = useState(initialRegion);
  const { data: stores } = api.store.findInBox.useQuery({
    location: region,
    filters: Object.values(filters ?? {}).filter((filterGroup) => {
      return filterGroup.length > 0;
    }),
  });
  const _stores = stores ?? [];
  const mapRef = useRef<MapView>(null);
  const carouselRef = useRef<ICarouselInstance>(null);

  const debounceRegionChange = debounce((region: Region) => {
    setRegion(region);
  }, 500);

  const animateCameraTo = (store: Store) => {
    mapRef.current?.animateCamera(
      {
        center: {
          latitude: store.latitude,
          longitude: store.longitude,
        },
      },
      {
        duration: 200,
      },
    );
  };

  const scrollCarouselTo = (index: number) => {
    carouselRef.current?.scrollTo({
      index,
      animated: true,
    });
  };

  return (
    <View className="flex-1">
      <FiltersScrollView
        className="absolute z-50 w-full py-3"
        bottomSheetRef={filterBottomSheetRef}
      />
      <MapView
        ref={mapRef}
        className="w-full flex-1"
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        userLocationPriority="balanced"
        showsUserLocation={true}
        showsMyLocationButton={true}
        minZoomLevel={7}
        mapPadding={{ top: 64, right: 4, bottom: 4, left: 4 }}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        onRegionChangeComplete={(region, { isGesture }) => {
          if (isGesture) {
            debounceRegionChange(region);
          }
        }}
        onMarkerPress={({ nativeEvent }) => {
          const storeIndex = _stores.findIndex((store) => {
            return store.id === nativeEvent.id;
          });

          animateCameraTo(_stores[storeIndex]);
          scrollCarouselTo(storeIndex);
        }}
      >
        {_stores.map((store) => {
          return (
            <Marker
              key={store.id}
              identifier={store.id}
              coordinate={{
                latitude: store.latitude,
                longitude: store.longitude,
              }}
            />
          );
        })}
      </MapView>
      {_stores.length > 0 ? (
        <View style={{ maxHeight: StoreItem.maxHeight }}>
          <Carousel
            key={_stores.length}
            ref={carouselRef}
            loop={false}
            width={Dimensions.get("window").width}
            data={_stores}
            scrollAnimationDuration={500}
            renderItem={({ item }) => {
              return <StoreItem data={item} />;
            }}
            onSnapToItem={(index) => {
              animateCameraTo(_stores[index]);
            }}
          />
        </View>
      ) : null}
    </View>
  );
}
