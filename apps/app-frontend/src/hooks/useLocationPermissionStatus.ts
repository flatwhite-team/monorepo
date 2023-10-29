import {
  LocationPermissionResponse,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useLocationPermissionStatus(
  options?: UseQueryOptions<LocationPermissionResponse>,
) {
  return useQuery<LocationPermissionResponse>({
    queryKey: ["locationPermissionStatus"],
    queryFn: requestForegroundPermissionsAsync,
    ...options,
  });
}
