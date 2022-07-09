import { Server } from "socket.io";
import * as http from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { removeSocket, handleLeaveRoom, handleNewGuess, handleJoinTeam, handleLeaveTeam } from "./socketListeners";

let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export const init = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*", //allowing cors from anywhere
    },
  });

  io.on("connection", (socket) => {
    console.log(`user joined: ${socket.id}`);
    socket.on("disconnect", (reason) => {
      console.log(`user disconnected: ${socket.id} beacause of ${reason}`);
    });

    socket.on("disconnecting", removeSocket(socket, io));
    socket.on("newGuess", handleNewGuess(socket, io));
    socket.on("joinTeam", handleJoinTeam(socket, io))
    socket.on("leaveTeam", handleLeaveTeam(socket, io))

    socket.on("joinRoom", ({ id }) => {
      socket.join(id);
      console.log(`joined: ${socket.id}`);
      io.of("/").to(id).emit("participantUpdate");
    });

    socket.on("leaveRoom", handleLeaveRoom(socket, io));

    socket.on("joinLobby", () => {
      socket.join("lobby");
    });
  });

  io.of("/").adapter.on("delete-room", () => {
    io.to("lobby").emit("roomsUpdated"); // TODO: consider moving from SWR to emitting map of rooms and participants
  });
};

export const getParticipantCount = ({ id }: { id: string }) =>
  io.sockets.adapter.rooms.get(id)?.size ?? 0;

export const hookSocketWithUser = async (userId: string, socketId: string) =>
  ((await io.in(socketId).fetchSockets())[0].data.userId = userId);