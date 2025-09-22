import { Category } from "./categories";
import { Media } from "./media1";
import { User } from "./users";

export interface Demand {
  id?: string;
  title: string;
  description: string;
  category: string | Category;
  user: string | User;
  trl_level: number;
  option: string;
  option_technology: string;
  option_rule: string;
  from_price: number;
  to_price: number;
  cooperation: string;
  documents: Media[];
  createdAt?: string;
  updatedAt?: string;
}
