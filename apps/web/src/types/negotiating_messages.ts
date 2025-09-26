import { Media } from "./media1";
import { Offer } from "./offer";
import { Propose } from "./propose";
import { ProjectPropose } from "./project-propose";
import { TechnologyPropose } from "./technology-propose";
import { User } from "./users";

export interface NegotiatingMessage {
  id: string;
  propose?: Propose;
  project_propose?: ProjectPropose;
  technology_propose?: TechnologyPropose;
  user: User;
  message: string;
  documents?: Media[];
  is_offer: boolean;
  offer?: Offer;
  createdAt: string;
  updatedAt: string;
}
