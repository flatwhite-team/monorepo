import { View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import { useCurrentLocation } from "~/hooks/useCurrentLocation";
import { useLocationPermissionStatus } from "~/hooks/useLocationPermissionStatus";

export function StoreMapTabContent() {
  const { data: locationPermissionStatus } = useLocationPermissionStatus();
  const { data: currentLocation } = useCurrentLocation({
    shouldUseFallbackLocation: !locationPermissionStatus?.granted,
  });

  return (
    <View className="flex-1">
      <MapView
        className="h-full w-full"
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: currentLocation?.coords.latitude ?? 37.5665,
          longitude: currentLocation?.coords.longitude ?? 126.978,
          latitudeDelta: 0.005,
          longitudeDelta: 0.002,
        }}
        userLocationPriority="balanced"
        showsUserLocation={true}
        showsMyLocationButton={true}
        minZoomLevel={7}
        pitchEnabled={false}
        toolbarEnabled={false}
        onRegionChangeComplete={(e) => {
          console.log(e);
        }}
      />
    </View>
  );
}
