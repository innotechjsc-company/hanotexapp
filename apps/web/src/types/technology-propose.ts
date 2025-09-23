import { Media } from "./media1";
import { Technology } from "./technologies";
import { User } from "./users";

export type TechnologyProposeStatus =
  | "pending"
  | "negotiating"
  | "contract_signed"
  | "completed"
  | "cancelled";

export interface TechnologyPropose {
  technology: Technology;
  user: User;
  description: string;
  document: Media;
  budget: number;
  status: TechnologyProposeStatus;
  createdAt?: string;
  updatedAt?: string;
}
