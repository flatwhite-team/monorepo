import { api } from "../../../utils/api";

export function useInfiniteStores({
  locationOptions,
  take,
}: {
  locationOptions: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  take: number;
}) {
  return api.store.infiniteFindByDistance.useInfiniteQuery(
    {
      locationOptions,
      take,
    },
    {
      queryKey: [useInfiniteStores.baseQueryKey, { locationOptions }],
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => {
        if (lastPage.length < take || lastPage.length === 0) {
          return undefined;
        }

        return lastPage[lastPage.length - 1].id;
      },
    },
  );
}

useInfiniteStores.baseQueryKey = "store.infiniteFindByDistance" as const;
