import { Store } from "../models/Store";
import { apiClient } from "../utils/apiClient";

export function fetchStore(id: string) {
  return apiClient<Store>({
    url: `/stores/${id}`,
  });
}
