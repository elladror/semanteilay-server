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
import { injectIO } from "./utils";

let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

const init = (server: http.Server) => {
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

  injectIO(io);
};

export default init;
