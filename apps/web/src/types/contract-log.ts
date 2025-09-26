import type { TechnologyPropose } from "./technology-propose";
import type { Contract } from "./contract";
import type { User } from "./users";
import type { Media } from "./media1";

export enum ContractLogStatus {
  Pending = "pending",
  Completed = "completed",
  Cancelled = "cancelled",
}

export interface ContractLog {
  id?: string;
  technology_propose: string | TechnologyPropose;
  contract?: Contract | string;
  user: User | string;
  content: string;
  documents?: Media | string | number | null;
  status: ContractLogStatus;
  reason?: string | null;
  is_done_contract?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
