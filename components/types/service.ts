export interface Provider {
  id: string;
  _id?: string
  verified?: boolean;
  featured?: boolean;
  name: string;
  cover: string;
  rating: number;
  desc: string;
  tags?: string[];
  location: string;
  projects: number;
  response: string;
  rate: string;
  reviews?: number;
}