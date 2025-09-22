import { User } from "./users";
import { Technology } from "./technologies";
import { Media } from "./media";
import { InvestmentFund } from "./investment_fund";

export type Project = {
  name: string;
  description: string;
  user: string | User;
  technology: string | Technology;
  investment_fund: string | InvestmentFund;
  status: string;
  goal_money: number;
  end_date: string;
  documents: Media[];
};
