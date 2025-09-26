import { Technology } from "./technologies";
import { User } from "./users";
import { Media } from "./media1";

export type TechnologyProposeStatus =
  | "pending"
  | "negotiating"
  | "contact_signing"
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
}
