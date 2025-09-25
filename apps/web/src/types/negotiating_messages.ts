import { Media } from "./media1";
import { Propose } from "./propose";
import { TechnologyPropose } from "./technology-propose";
import { User } from "./users";

export interface NegotiatingMessage {
  propose: Propose;
  technology_propose: TechnologyPropose;
  user: User;
  message: string;
  documents: Media[];
}
