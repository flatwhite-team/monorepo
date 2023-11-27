import { RefObject, useEffect, useState } from "react";
import { Button, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { JoinedStore } from "@flatwhite-team/trpc-server/src/router/store";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { debounce } from "lodash";

import { DEFAULT_LATITUDE_DELTA, DEFAULT_LONGITUDE_DELTA } from "~/constants";
import { useCustomLocation } from "~/providers/CustomLocationProvider";
import { api } from "~/utils/api";

interface Props {
  storeListRef: RefObject<FlashList<JoinedStore>>;
}

export function CustomLocationScreen({ storeListRef }: Props) {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const { location, setLocation } = useCustomLocation();
  const initialRegion = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: DEFAULT_LATITUDE_DELTA,
    longitudeDelta: DEFAULT_LONGITUDE_DELTA,
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
      className="bg-background flex-1"
      style={{ paddingBottom: inset.bottom }}
    >
      <MapView
        className="w-full flex-1"
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        userLocationPriority="balanced"
        showsUserLocation={true}
        showsMyLocationButton={true}
        minZoomLevel={7}
        mapPadding={{ top: 4, right: 4, bottom: 4, left: 4 }}
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
            storeListRef.current?.scrollToOffset({
              offset: 0,
            });
          }}
        />
      </View>
    </View>
  );
}
