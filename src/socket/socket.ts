import { Server } from "socket.io";
import * as http from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
  removeSocket,
  handleLeaveRoom,
  handleNewGuess,
  handleSwitchTeam,
  handleJoinRoom,
  handleRoomsUpdate,
} from "./socketListeners";

let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export const init = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // allowing cors from anywhere
    },
  });

  io.on("connection", (socket) => {
    socket.on("disconnecting", removeSocket(socket, io));
    socket.on("newGuess", handleNewGuess(socket, io));
    socket.on("switchTeam", handleSwitchTeam(socket, io));
    socket.on("joinRoom", handleJoinRoom(socket, io));
    socket.on("leaveRoom", handleLeaveRoom(socket, io));
    socket.on("create-room", handleRoomsUpdate(socket, io));
    socket.on("delete-room", handleRoomsUpdate(socket, io));
    socket.on("joinLobby", () => {
      socket.join("lobby");
    });
  });
};
export const getParticipantCount = ({ id }: { id: string }) =>
  io.sockets.adapter.rooms.get(id)?.size ?? 0;

export const hookSocketWithUser = async (userId: string, socketId: string) => {
  (await io.in(socketId).fetchSockets())[0].data.userId = userId;
};

export const emitRoomDeleted = () => {
  io.to("lobby").emit("roomsUpdated");
};
