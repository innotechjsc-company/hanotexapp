import { User } from "./users";
import { Technology } from "./technologies";
import { Media } from "./media1";
import { InvestmentFund } from "./investment_fund";

export enum ProjectStatusEnum {
  PENDING = "pending",
  NEGOTIATING = "negotiating",
  CONTRACT_SIGNED = "contract_signed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export type Project = {
  name: string;
  description: string;
  business_model?: string;
  market_data?: string;
  user: string | User;
  technologies: string[] | Technology[];
  investment_fund?: string[] | InvestmentFund[];
  revenue?: number;
  profit?: number;
  assets?: number;
  documents_finance?: string[] | Media[];
  team_profile?: string;
  goal_money?: number;
  share_percentage?: number;
  goal_money_purpose?: string;
  status: ProjectStatusEnum;
  end_date: string;
};
