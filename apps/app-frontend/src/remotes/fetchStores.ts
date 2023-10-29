import { Store } from "../models/Store";
import { apiClient } from "../utils/apiClient";

interface Params {
  coords: {
    lat: number;
    long: number;
  };
  radius: number;
  page: {
    size: number;
    cursor?: Store["id"];
  };
}

export function fetchStores({ coords, radius, page }: Params) {
  return apiClient<Store[]>({
    url: "/stores",
    params: {
      ...coords,
      radius,
      size: page.size,
      storeIdCursor: page?.cursor,
    },
  });
}
