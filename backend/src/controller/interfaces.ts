import Room from "../domain/Room";

export interface IRoomsRepo {
  add: (room: Room) => void;
  load: (code: string) => Room | undefined;
}

export interface ISocketRepository {
  joinRoom: (roomCode: string) => void;
  sendEventToPlayer: (event: string, data: any) => void;
  sendEventToRoom: (roomCode: string, event: string, data: any) => void;
  sendEventToRoomExceptSender: (roomCode: string, event: string, data: any) => void;
}
