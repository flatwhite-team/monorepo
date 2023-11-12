import { useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { debounce } from "lodash";

import { useCurrentLocation } from "~/hooks/useCurrentLocation";
import { useLocationPermissionStatus } from "~/hooks/useLocationPermissionStatus";
import { api } from "~/utils/api";
import { StoreItem } from "../components/StoreItem";

export function StoreMapTabContent() {
  const { data: locationPermissionStatus } = useLocationPermissionStatus();
  const { data: currentLocation } = useCurrentLocation({
    shouldUseFallbackLocation: !locationPermissionStatus?.granted,
  });
  const [region, setRegion] = useState({
    latitude: currentLocation?.coords.latitude ?? 37.5665,
    longitude: currentLocation?.coords.longitude ?? 126.978,
    latitudeDelta: 0.005,
    longitudeDelta: 0.002,
  });
  const { data: stores } = api.store.findInBox.useQuery(region);
  const _stores = stores ?? [];
  const mapRef = useRef<MapView>(null);
  const carouselRef = useRef<ICarouselInstance>(null);

  const handleRegionChangeComplete = debounce((region) => {
    setRegion(region);
  }, 500);

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        className="w-full flex-1"
        provider={PROVIDER_GOOGLE}
        region={region}
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
    </View>
  );
}
