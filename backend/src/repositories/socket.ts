import { Server as SocketServer, Socket } from "socket.io";
import { ISocketRepository } from "../controller/interfaces";

export class SocketRepository implements ISocketRepository {
  constructor(
    private io: InstanceType<typeof SocketServer>,
    private socket: Socket
  ) {}

  joinRoom(roomCode: string) {
    this.socket.join(roomCode);
  }

  sendEventToPlayer(event: string, data: any) {
    this.socket.emit(event, data);
  }

  sendEventToRoom(roomCode: string, event: string, data: any) {
    this.io.in(roomCode).emit(event, data);
  }

  sendEventToRoomExceptSender(roomCode: string, event: string, data: any) {
    this.socket.to(roomCode).emit(event, data);
  }
}
