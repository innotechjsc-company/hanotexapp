import { User } from "./users";

export interface RoomUser {
  id: string;
  room: string;
  user: User;
  updatedAt: string;
  createdAt: string;
}
