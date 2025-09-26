import type { TechnologyPropose } from "./technology-propose";
import type { Contract } from "./contract";
import type { Propose } from "./propose";
import type { ProjectPropose } from "./project-propose";
import type { User } from "./users";
import type { Media } from "./media1";

export enum ContractLogStatus {
  Pending = "pending",
  Completed = "completed",
  Cancelled = "cancelled",
}

export interface ContractLog {
  id: string;
  technology_propose?: TechnologyPropose;
  propose?: Propose;
  project_propose?: ProjectPropose;
  contract: Contract;
  user: User;
  content: string;
  documents?: Media;
  reason?: string;
  status: ContractLogStatus;
  is_done_contract?: boolean;
  createdAt: string;
  updatedAt: string;
}
