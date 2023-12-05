import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

import { MarkedMapScreenRouteProp } from "~/navigation/HomeStackNavigator";

export function MarkedMapScreen() {
  const { params } = useRoute<MarkedMapScreenRouteProp>();

  return (
    <View className="bg-background flex-1">
      <MapView
        className="w-full flex-1"
        provider={PROVIDER_GOOGLE}
        initialCamera={{
          center: {
            latitude: params.latitude,
            longitude: params.longitude,
          },
          heading: 0,
          pitch: 0,
          zoom: 17,
        }}
        userLocationPriority="balanced"
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={{
            latitude: params.latitude,
            longitude: params.longitude,
          }}
        />
      </MapView>
    </View>
  );
}
