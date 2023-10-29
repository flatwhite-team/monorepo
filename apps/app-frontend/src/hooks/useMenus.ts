import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { Menu } from "../models/Menu";
import { fetchMenus } from "../remotes/fetchMenus";

export function useMenus(storeId: string, options?: UseQueryOptions<Menu[]>) {
  return useQuery({
    queryKey: useMenus.queryKey(storeId),
    queryFn: () => {
      return fetchMenus(storeId);
    },
    ...options,
  });
}

useMenus.queryKey = (storeId: string) => {
  return ["/stores/:storeId/menus", storeId];
};
