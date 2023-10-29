import { BusinessDay } from "./BusinessDay";
import { Menu } from "./Menu";

export interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string | null;
  images: Array<{ url: string }>;
  tel: string | null;
  menus: Menu[];
  businessDays: BusinessDay[];
}
