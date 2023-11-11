import { useState } from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { useCurrentLocation } from "~/hooks/useCurrentLocation";
import { useLocationPermissionStatus } from "~/hooks/useLocationPermissionStatus";
import { api } from "~/utils/api";

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

  return (
    <View className="flex-1">
      <MapView
        className="h-full w-full"
        provider={PROVIDER_GOOGLE}
        region={region}
        userLocationPriority="balanced"
        showsUserLocation={true}
        showsMyLocationButton={true}
        minZoomLevel={7}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        onRegionChangeComplete={(region) => {
          setRegion(region);
        }}
      >
        {stores.map(({ id, latitude, longitude }) => {
          return (
            <Marker
              key={id}
              coordinate={{
                latitude,
                longitude,
              }}
            />
          );
        })}
      </MapView>
    </View>
  );
}
