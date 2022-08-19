import { emitToSocket, hookSocketWithUser } from "../socket/utils";
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

export const setIdle = (userId: string) => repository.setIdle({ id: userId });

export const getUserById = async (id: string) => repository.getUserById({ id });

export const deleteUser = async (userId: string) =>
  repository.deleteUser({ id: userId });

export const userCountInRoom = async (roomId: string) =>
  repository.userCountInRoom(roomId);

export const joinRoom = async ({
  userId,
  roomId,
}: {
  userId: string;
  roomId: string;
}) => repository.joinRoom({ userId, roomId });

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

  const DELETE_ROOM_IF_EMPTY_DELAY = 1000 * 10 * 1;

  console.log("called");

  setTimeout(async () => {
    try {
      if ((await userCountInRoom(roomId)) === 0) {
        console.log("delayed delete room called");
        await deleteRoom(roomId);
        emitToSocket({ event: "kickFromTeam", socketId });
      }
    } catch (error) {
      console.error(error);
    }
  }, DELETE_ROOM_IF_EMPTY_DELAY);
};
