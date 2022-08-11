import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { deleteUser, leaveRoom } from "../services/userService";
import {
  isTeam,
  isRoom,
  asRoomId,
  asTeamId,
  asSocketRoomId,
  asSocketTeamId,
} from "./utils";

type SocketListener = (
  // eslint-disable-next-line no-unused-vars
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  // eslint-disable-next-line no-unused-vars
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  // eslint-disable-next-line no-unused-vars
) => (...args: any) => void;

export const removeSocket: SocketListener = (socket) => async () => {
  const socketTeamId = Array.from(socket.rooms).find(isTeam) as string;
  const socketRoomId = Array.from(socket.rooms).find(isRoom);

  if (socketRoomId) {
    socket.leave(socketRoomId);

    if (socketTeamId) {
      try {
        await leaveRoom({
          userId: socket.data.userId,
          roomId: asRoomId(socketRoomId),
          teamId: asTeamId(socketTeamId),
        });
      } catch (error) {
        console.log("failed to leave socket team and rooms from disconnect");
      }
    }

    socket.to(socketRoomId).emit("participantUpdate");
  }

  socket.leave("lobby");
  socket.leave(socketTeamId);

  if (socket.data.userId) deleteUser(socket.data.userId);
};

export const handleLeaveRoom: SocketListener =
  (socket, io) =>
  async ({ id }) => {
    const socketTeamId = Array.from(socket.rooms).find(isTeam);

    socket.leave(asSocketRoomId(id));

    if (socketTeamId) {
      socket.leave(socketTeamId);
      await leaveRoom({
        userId: socket.data.userId,
        roomId: id,
        teamId: asTeamId(socketTeamId),
      });
    }

    io.to(socket.id).emit("kickFromTeam");
    io.of("/").to(asSocketRoomId(id)).emit("participantUpdate");
  };

export const handleJoinRoom: SocketListener =
  (socket, io) =>
  ({ id }) => {
    socket.join(asSocketRoomId(id));
    io.of("/").to(asSocketRoomId(id)).emit("participantUpdate");
  };

export const handleSwitchTeam: SocketListener =
  // eslint-disable-next-line no-unused-vars, prettier/prettier
  (socket, _io) =>
    async ({ newTeamId, oldTeamId }) => {
      if (oldTeamId) socket.leave(asSocketTeamId(oldTeamId));
      socket.join(asSocketTeamId(newTeamId));
    };

// eslint-disable-next-line no-unused-vars, prettier/prettier
export const handleNewGuess: SocketListener = (socket, _io) => async (guess) => {
    socket.to(asSocketTeamId(guess.team)).emit("newGuess", guess);
  };

export const handleRoomsUpdate: SocketListener = (_socket, io) => async () => {
  io.to("lobby").emit("roomsUpdated"); // TODO: consider moving from SWR to emitting map of rooms and participants
};
