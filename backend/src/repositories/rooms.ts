import { IRoomsRepo } from "../controller/interfaces";
import Room from "../domain/Room";

export class RoomsRepository implements IRoomsRepo {
  rooms: Record<string, Room> = {};
  add(room: Room) {
    this.rooms[room.code] = room;
  }
  load(code: string) {
    return this.rooms[code];
  }
}
