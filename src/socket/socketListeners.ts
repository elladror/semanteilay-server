import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { deleteUser, leaveRoom } from "../services/userService";

type SocketListener = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => (...args: any) => void;

export const removeSocket: SocketListener = (socket) => () => {
  const userId = socket.data.userId;
  console.log(`user left with id: ${userId}`);

  Array.from(socket.rooms)
    .filter(isTeam(socket))
    .forEach(async (roomId) => {
      //TODO: add lobby leave
      await leaveRoom(userId, roomId);
      socket.to(roomId).emit("participantUpdate");
    });

  deleteUser(userId);
};

export const handleLeaveRoom: SocketListener =
  (socket, io) =>
  async ({ id }) => {
    const userId = socket.data.userId;
    socket.leave(id);
    socket.leave(Array.from(socket.rooms).find(isTeam(socket)) as string);
    await leaveRoom(userId, id);
    io.to(socket.id).emit("kickFromTeam");
    io.of("/").to(id).emit("participantUpdate");
  };

export const handleNewGuess: SocketListener = (socket, io) => async (guess) => {
  socket.to(guess.team).emit("newGuess", guess);
};

export const handleJoinTeam: SocketListener = (socket, io) => async (teamId) => {
  console.log(`socket: ${socket.id} joined team: ${teamId}`);
  socket.join(teamId);
};

export const handleLeaveTeam: SocketListener = (socket, io) => async (teamId) => {
  console.log(`socket: ${socket.id} left team: ${teamId}`);
  socket.leave(teamId);
};

const isTeam =
  (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => (roomId: string) =>
    roomId !== socket.id && roomId !== "lobby";
