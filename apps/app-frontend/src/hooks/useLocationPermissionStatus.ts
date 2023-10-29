import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import {
  LocationPermissionResponse,
  requestForegroundPermissionsAsync,
} from "expo-location";

export function useLocationPermissionStatus(
  options?: UseQueryOptions<LocationPermissionResponse>
) {
  return useQuery<LocationPermissionResponse>({
    queryKey: ["locationPermissionStatus"],
    queryFn: requestForegroundPermissionsAsync,
    ...options,
  });
}
