// TODO: fix circular import
import { emitRoomDeleted, getParticipantCount } from "../socket/utils";
import * as repository from "../repositories/roomRepository";

export const createRoom = async (name: string) =>
  repository.createRoom({ name });

export const getAllRooms = async () => {
  const rooms = await repository.getAllRooms();

  return rooms.map((room) => {
    const participantCount = getParticipantCount(room);
    return { ...room, participantCount };
  });
};

export const getPopulatedRoomById = async (id: string) => {
  const room = await repository.getRoomById({ id }, true);
  const participantCount = getParticipantCount(room);

  return { ...room, participantCount };
};

export const deleteRoomIfEmpty = async (roomId: string) => {
  const room = await repository.getRoomById({ id: roomId }, true);
  if (room.teams.length === 0) {
    await repository.deleteRoom({ id: roomId });
    emitRoomDeleted();
  }
};
