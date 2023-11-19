import { Characteristic } from "@flatwhite-team/prisma";

import { api } from "../../../../utils/api";

export function useInfiniteStores({
  locationOptions,
  characteristics,
  take,
}: {
  locationOptions: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  characteristics?: Characteristic[];
  take: number;
}) {
  return api.store.infiniteFindByDistance.useInfiniteQuery(
    {
      locationOptions,
      characteristics,
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
