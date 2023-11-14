import {
  getCurrentPositionAsync,
  LocationAccuracy,
  LocationObjectCoords,
  LocationOptions,
} from "expo-location";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useLocationPermissionStatus } from "./useLocationPermissionStatus";

export type LocationObject = {
  coords: Pick<LocationObjectCoords, "latitude" | "longitude">;
};

export function useCurrentLocation({
  locationOptions,
  queryOptions,
}: {
  locationOptions?: LocationOptions;
  queryOptions?: UseQueryOptions<LocationObject | null>;
} = {}) {
  const { data: locationPermissionStatus } = useLocationPermissionStatus();

  return useQuery<LocationObject | null>({
    queryKey: useCurrentLocation.queryKey,
    queryFn: () => {
      if (!locationPermissionStatus?.granted) {
        return null;
      }

      return getCurrentPositionAsync({
        accuracy: LocationAccuracy.Balanced,
        ...locationOptions,
      });
    },
    ...queryOptions,
  });
}

useCurrentLocation.queryKey = ["currentLocation"];
