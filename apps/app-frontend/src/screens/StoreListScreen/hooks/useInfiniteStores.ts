import {
  UndefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Store } from "../../../models/Store";
import { fetchStores } from "../../../remotes/fetchStores";

interface PageOptions {
  size: number;
}

export function useInfiniteStores(
  {
    lat,
    long,
    radius,
  }: {
    lat: number;
    long: number;
    radius: number;
  },
  pageOptions: PageOptions,
  queryOptions?: UndefinedInitialDataInfiniteOptions<Store[]>
) {
  return useInfiniteQuery<Store[]>({
    queryKey: useInfiniteStores.queryKey(
      { lat, long, radius },
      { size: pageOptions.size }
    ),
    queryFn: ({ pageParam: storeIdCursor }) => {
      return fetchStores({
        coords: {
          lat,
          long,
        },
        radius,
        page: {
          size: pageOptions.size,
          cursor: storeIdCursor as string | undefined,
        },
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < pageOptions.size || lastPage.length === 0) {
        return undefined;
      }

      return lastPage[lastPage.length - 1].id;
    },
    ...queryOptions,
  });
}

useInfiniteStores.baseQueryKey = "/stores";
useInfiniteStores.queryKey = (
  locationOptions: {
    lat: number;
    long: number;
    radius: number;
  },
  pageOptions: PageOptions
) => {
  return [useInfiniteStores.baseQueryKey, locationOptions, pageOptions];
};
