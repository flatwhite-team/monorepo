import { Characteristic } from "@flatwhite-team/prisma";

import { api } from "../../../../utils/api";

export function useInfiniteStores({
  locationOptions,
  characteristics,
  filters,
  take,
}: {
  locationOptions: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  filters?: Characteristic[][];
  characteristics?: Characteristic[];
  take: number;
}) {
  return api.store.infiniteFindByDistance.useInfiniteQuery(
    {
      locationOptions,
      characteristics,
      filters,
      take,
    },
    {
      queryKey: [
        useInfiniteStores.baseQueryKey,
        { locationOptions, characteristics },
      ],
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
