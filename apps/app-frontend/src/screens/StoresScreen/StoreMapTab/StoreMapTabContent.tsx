import { useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import BottomSheet from "@gorhom/bottom-sheet";
import { RouteProp, useRoute } from "@react-navigation/native";
import { debounce } from "lodash";

import { HomeStackParamList } from "~/navigation/HomeStackNavigator";
import { useCustomLocation } from "~/providers/CustomLocationProvider";
import { api } from "~/utils/api";
import { FiltersBottomSheet } from "../components/FiltersBottomSheet";
import { FiltersScrollView } from "../components/FiltersScrollView";
import { StoreItem } from "../components/StoreItem";

export function StoreMapTabContent() {
  const {
    params: { filters },
  } = useRoute<RouteProp<HomeStackParamList, "StoresScreen">>();
  const { location } = useCustomLocation();
  const initialRegion = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.002,
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
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleRegionChangeComplete = debounce((region: Region) => {
    setRegion(region);
  }, 500);

  return (
    <View className="flex-1">
      <FiltersScrollView
        className="absolute z-50 w-full py-3"
        bottomSheetRef={bottomSheetRef}
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
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        onRegionChangeComplete={handleRegionChangeComplete}
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
            ref={carouselRef}
            loop={false}
            width={Dimensions.get("window").width}
            data={_stores}
            scrollAnimationDuration={300}
            renderItem={({ item }) => {
              return <StoreItem data={item} />;
            }}
          />
        </View>
      ) : null}
      <FiltersBottomSheet ref={bottomSheetRef} />
    </View>
  );
}
