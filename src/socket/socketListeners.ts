import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { setIdle } from "../services/userService";
import { isRoom, asSocketRoomId, asSocketTeamId, isTeam } from "./utils";

type SocketListener = (
  // eslint-disable-next-line no-unused-vars
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  // eslint-disable-next-line no-unused-vars
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  // eslint-disable-next-line no-unused-vars
) => (...args: any) => void;

export const removeSocket: SocketListener = (socket) => async () => {
  try {
    if (socket.data.userId) await setIdle(socket.data.userId);
  } catch (_error) {
    //
  }

  const socketRoomId = Array.from(socket.rooms).find(isRoom) as string;

  if (socketRoomId) socket.to(socketRoomId).emit("participantUpdate");
};

export const handleLeaveRoom: SocketListener = (socket, io) => async (id) => {
  socket.leave(asSocketRoomId(id));
  const socketTeamId = Array.from(socket.rooms).find(isTeam) as string;
  socket.leave(socketTeamId);
  io.of("/").to(asSocketRoomId(id)).emit("participantUpdate");
};

export const handleJoinRoom: SocketListener = (socket, io) => (id) => {
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

export const handleLeaveTeam: SocketListener =
  // eslint-disable-next-line no-unused-vars, prettier/prettier
    (socket, _io) =>
    async (teamId) => {
    socket.leave(asSocketTeamId(teamId));
  };

// eslint-disable-next-line no-unused-vars, prettier/prettier
export const handleNewGuess: SocketListener = (socket, _io) => async (guess) => {
    socket.to(asSocketTeamId(guess.teamId)).emit("newGuess", guess);
  };

export const handleRoomsUpdate: SocketListener = (_socket, io) => async () => {
  io.to("lobby").emit("roomsUpdated"); // TODO: consider moving from SWR to emitting map of rooms and participants
};
