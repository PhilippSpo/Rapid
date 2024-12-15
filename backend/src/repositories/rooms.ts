import { RoomsRepo } from "../controller/lobby";
import Room from "../domain/Room";

export class RoomsRepository implements RoomsRepo {
  rooms: Record<string, Room> = {};
  add(room: Room) {
    this.rooms[room.code] = room;
  }
  load(code: string) {
    return this.rooms[code];
  }
}
