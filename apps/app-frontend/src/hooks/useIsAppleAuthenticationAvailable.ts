import { isAvailableAsync } from "expo-apple-authentication";
import { useQuery } from "@tanstack/react-query";

export function useIsAppleAuthenticationAvailable() {
  return useQuery(["isAppleAuthenticationAvailable"], () => {
    return isAvailableAsync();
  });
}
