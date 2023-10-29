import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { Store } from "../models/Store";
import { fetchStore } from "../remotes/fetchStore";

export function useStore(id: string, options?: UseQueryOptions<Store>) {
  return useQuery<Store>({
    queryKey: useStore.queryKey(id),
    queryFn: () => {
      return fetchStore(id);
    },
    ...options,
  });
}

useStore.queryKey = (id: string) => {
  return ["/stores/:id", id];
};
