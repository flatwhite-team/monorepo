export interface Menu {
  id: string;
  name: string;
  price: number | null;
  description: string | null;
  images: Array<{ url: string }>;
}
