import { hookSocketWithUser } from "../socket/socket";
import * as repository from "../repositories/userRepository";
import { deleteRoomIfEmpty } from "./roomService";
import { leaveTeam } from "./teamService";

export const signUp = async (name: string, socketId: string) => {
  if (await repository.isNameTaken({ name })) {
    throw new Error("nickname taken");
  }

  const { id } = await repository.createUser({ name });
  await hookSocketWithUser(id, socketId);

  return id;
};

export const getUserById = async (id: string) => repository.getUserById({ id });

export const leaveRoom = async (
  userId: string,
  roomId: string,
  teamId: string
) => {
  await leaveTeam(userId, teamId);
  await deleteRoomIfEmpty(roomId);
};

export const deleteUser = async (userId: string) =>
  repository.deleteUser({ id: userId });
