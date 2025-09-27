import { Demand } from "./demand";
import { Media } from "./media1";
import { Technology } from "./technologies";
import { User } from "./users";

export enum ProposeStatusEnum {
  pending = "pending",
  negotiating = "negotiating",
  contact_signing = "contact_signing",
  contract_signed = "contract_signed",
  completed = "completed",
  cancelled = "cancelled",
}

export type ProposeStatus =
  | "pending"
  | "negotiating"
  | "contact_signing"
  | "contract_signed"
  | "completed"
  | "cancelled";

export interface Propose {
  id?: string;
  title: string;
  demand: Demand;
  user: User;
  technology: Technology;
  description: string;
  execution_time: string;
  estimated_cost: number;
  cooperation_conditions: string;
  document: Media;
  status: ProposeStatus;
  createdAt?: string;
  updatedAt?: string;
}
