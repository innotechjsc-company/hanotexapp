import { TechnologyPropose } from "./technology-propose";
import { NegotiatingMessage } from "./negotiating_messages";
import { Propose } from "./propose";
import { ProjectPropose } from "./project-propose";

export enum OfferStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export interface Offer {
  id: string;
  propose?: Propose;
  project_propose?: ProjectPropose;
  technology_propose?: TechnologyPropose;
  negotiating_messages: NegotiatingMessage;
  content: string;
  price: number;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
}
