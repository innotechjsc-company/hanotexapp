import { Demand } from "./demand";
import { Media } from "./media1";
import { Technology } from "./technologies";
import { User } from "./users";

export type ProposeStatus = "pending" | "accepted" | "rejected";

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
