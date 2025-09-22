import { Media } from "./Media";
import { Technology } from "./technologies";
import { User } from "./users";

export type TechnologyProposeStatus = "pending" | "accepted" | "rejected";

export interface TechnologyPropose {
  technology: Technology;
  user: User;
  description: string;
  document: Media;
  status: TechnologyProposeStatus;
}
