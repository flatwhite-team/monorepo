import { useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { debounce } from "lodash";

import { colors } from "~/constants";
import { useCustomLocation } from "~/providers/CustomLocationProvider";
import { api } from "~/utils/api";

export function CustomLocationScreen() {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const { location, setLocation } = useCustomLocation();
  const initialRegion = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.002,
  };
  const [region, setRegion] = useState(initialRegion);
  const [regionForQuery, setRegionForQuery] = useState(region);
  const { data: stores } = api.store.findInBox.useQuery({
    location: regionForQuery,
  });
  const debounceSetRegionForQuery = debounce((region: Region) => {
    setRegionForQuery(region);
  }, 700);

  useEffect(() => {
    debounceSetRegionForQuery(region);
  }, [region]);

  return (
    <View
      style={{
        ...Style.wrapper,
        paddingBottom: inset.bottom,
      }}
    >
      <MapView
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
        onRegionChangeComplete={setRegion}
      >
        {stores?.map((store) => {
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
      <View>
        <Button
          title="이 위치 카페 보기"
          onPress={() => {
            setLocation({
              latitude: region.latitude,
              longitude: region.longitude,
            });
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
}

const Style = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
