import { emitToRoom, emitToSocket, hookSocketWithUser } from "../socket/utils";
import * as repository from "../repositories/userRepository";
import { deleteRoom } from "./roomService";

export const signUp = async (name: string, socketId: string) => {
  if (await repository.isNameTaken({ name })) {
    throw new Error("nickname taken");
  }

  const { id } = await repository.createUser({ name });
  await hookSocketWithUser(id, socketId);

  return id;
};

export const login = async ({
  userId,
  socketId,
}: {
  userId: string;
  socketId: string;
}) => {
  const user = await repository.login({ id: userId });
  await hookSocketWithUser(userId, socketId);

  return user;
};

export const setIdle = async (userId: string) => {
  const updatedUser = await repository.setIdle({ id: userId });

  if (updatedUser.roomId)
    emitToRoom({ event: "participantUpdate", roomId: updatedUser.roomId });

  return updatedUser;
};

export const getUserById = async (id: string) => repository.getUserById({ id });

export const deleteUser = async (userId: string) =>
  repository.deleteUser({ id: userId });

export const userCountInRoom = async (roomId: string) =>
  repository.userCountInRoom(roomId);

export const leaveRoom = async ({
  roomId,
  userId,
  socketId,
}: {
  roomId: string;
  userId: string;
  socketId: string;
}) => {
  await repository.leaveRoom({ id: userId });

  const DELETE_ROOM_IF_EMPTY_DELAY = 1000 * 60 * 5;

  setTimeout(async () => {
    try {
      if ((await userCountInRoom(roomId)) === 0) {
        await deleteRoom(roomId);
        emitToSocket({ event: "kickFromTeam", socketId });
      }
    } catch (error) {
      console.error(error);
    }
  }, DELETE_ROOM_IF_EMPTY_DELAY);
};

export const joinRoom = async ({
  userId,
  roomId,
  socketId,
}: {
  userId: string;
  roomId: string;
  socketId: string;
}) => {
  const { roomId: oldRoomId } = await repository.getUserById({ id: userId });
  if (oldRoomId) leaveRoom({ userId, roomId: oldRoomId, socketId });

  return repository.joinRoom({ userId, roomId });
};

export const joinTeam = async ({
  userId,
  teamId,
}: {
  userId: string;
  teamId: string;
}) => repository.joinTeam({ userId, teamId });

export const leaveTeam = async ({ userId }: { userId: string }) =>
  repository.leaveTeam({ userId });
