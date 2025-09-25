import type { User } from "./users";
import type { Technology } from "./technologies";
import type { TechnologyPropose } from "./technology-propose";
import type { Offer } from "./offer";
import { Media } from "./media1";

export enum ContractStatusEnum {
  SIGNED = "signed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Contract {
  id: string;
  user_a: User;
  user_b: User;
  technologies: Technology[];
  technology_propose: TechnologyPropose;
  offer: Offer;
  contract_file?: Media;
  documents?: Media[];
  status: ContractStatusEnum;
  createdAt: string;
  updatedAt: string;
}
