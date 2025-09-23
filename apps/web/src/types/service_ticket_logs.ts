import { Media } from "./media1";
import { ServiceTicket } from "./service-ticket";
import { User } from "./users";

export interface ServiceTicketLog {
  service_ticket: ServiceTicket;
  user: User;
  content: string;
  document: Media;
  status: string;
  reason: string;
  createdAt?: string;
  updatedAt?: string;
}
