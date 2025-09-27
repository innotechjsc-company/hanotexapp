import { User } from "./users";
import { Media } from "./media1";

export type InvestmentFund = {
  id: string;
  image?: string | Media;
  name: string;
  description: string;
  user: string | User;
};
