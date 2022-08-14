// TODO: fix circular import
import { emitRoomDeleted } from "../socket/utils";
import * as repository from "../repositories/roomRepository";

export const createRoom = async (name: string) =>
  repository.createRoom({ name });

export const getAllRooms = async () => repository.getAllRooms();

export const getPopulatedRoomById = async (id: string) =>
  repository.getRoomById({ id });

export const deleteRoomIfEmpty = async (roomId: string) => {
  const room = await repository.getRoomById({ id: roomId });

  if (room.teams.length === 0) {
    await repository.deleteRoom({ id: roomId });
    emitRoomDeleted();
  }
};
