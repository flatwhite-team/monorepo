import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import {
  LocationAccuracy,
  LocationObjectCoords,
  LocationOptions,
  getCurrentPositionAsync,
} from "expo-location";
import { DEFAULT_COORDS } from "../constants";

type LocationObject = {
  coords: Pick<LocationObjectCoords, "latitude" | "longitude">;
};

export function useCurrentLocation({
  locationOptions,
  queryOptions,
  shouldUseFallbackLocation = false,
}: {
  locationOptions?: LocationOptions;
  queryOptions?: UseQueryOptions<LocationObject>;
  shouldUseFallbackLocation?: boolean;
} = {}) {
  return useQuery<LocationObject>({
    queryKey: useCurrentLocation.queryKey(shouldUseFallbackLocation),
    queryFn: () => {
      if (shouldUseFallbackLocation) {
        return {
          coords: {
            latitude: DEFAULT_COORDS.latitude,
            longitude: DEFAULT_COORDS.longitude,
          },
        };
      }

      return getCurrentPositionAsync({
        accuracy: LocationAccuracy.Balanced,
        ...locationOptions,
      });
    },
    ...queryOptions,
  });
}

useCurrentLocation.baseQueryKey = "currentLocation";
useCurrentLocation.queryKey = (shouldUseFallbackLocation: boolean) => {
  return [useCurrentLocation.baseQueryKey, shouldUseFallbackLocation];
};
