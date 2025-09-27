import { Media } from "./media1";
import { ServiceTicket } from "./service-ticket";
import { User } from "./users";

export enum ServiceTicketLogStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface ServiceTicketLog {
  id?: string;
  service_ticket: ServiceTicket;
  user: User;
  content: string;
  document: Media;
  status: string;
  reason: string;
  is_done_service: boolean;
  createdAt?: string;
  updatedAt?: string;
}
