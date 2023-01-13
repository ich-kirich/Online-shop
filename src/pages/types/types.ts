export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export type AllFiltersType = {
  category: string;
  brand: string;
  price: string;
  stock: string;
  search: string;
  type: string;
  view: string;
};

export type CartObject = {
  id: string;
  stock: string | undefined;
  price: number;
  count: number;
};