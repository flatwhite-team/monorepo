import { Menu } from "../models/Menu";
import { apiClient } from "../utils/apiClient";

export function fetchMenus(storeId: string) {
  return apiClient<Menu[]>({
    url: `/stores/${storeId}/menus`,
  });
}
