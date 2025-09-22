import { User } from "./users";

export type InvestmentFund = {
  id: string;
  name: string;
  description: string;
  user: string | User;
};
