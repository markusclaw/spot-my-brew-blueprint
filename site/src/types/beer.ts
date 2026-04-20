export interface Beer {
  id: string;
  name: string;
  brewery: string;
  origin: string;
  style: string;
  color: string;
  abv: number;
  ibu: number;
  description: string;
  rating?: number;
  reviews?: number;
}
