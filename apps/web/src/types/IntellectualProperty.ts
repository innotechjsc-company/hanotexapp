import { ID } from "./common";
import { Technology } from "./technologies";

export type IPType =
  | "patent"
  | "utility_solution"
  | "industrial_design"
  | "trademark"
  | "copyright"
  | "trade_secret";

export type IPStatus = "pending" | "granted" | "expired" | "rejected";

export interface IntellectualProperty {
  id?: ID;
  technology: ID | Technology;
  code: string;
  type: IPType;
  status: IPStatus;
}
