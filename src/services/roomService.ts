import { getParticipantCount } from "../socket/socket";
import * as repository from "../repositories/roomRepository";

export const createRoom = async (name: string) => await repository.createRoom(name);

export const getAllRooms = async () => {
  const rooms = await repository.getAllRooms();

  return rooms.map((room) => {
    const participantCount = getParticipantCount(room);
    return { ...room, participantCount };
  });
};

export const getRoomById = async (id: string) => (await repository.getRoomById(id)).formatted();

export const getPopulatedRoomById = async (id: string) => {
  const room = await repository.getRoomById(id);
  const populatedRoom = await room.populate();
  const participantCount = getParticipantCount(populatedRoom);

  return { ...populatedRoom, participantCount };
};

export const addTeamToRoom = async (roomId: string, teamId: string) => {
  const room = await repository.getRoomById(roomId);

  await room.addTeam(teamId);
};

export const removeTeamFromRoom = async (roomId: string, teamId: string) => {
  const room = await repository.removeTeam(teamId, roomId);

  if (room.isEmpty()) {
    await room.delete();
  }
};

export const deleteRoomIfEmpty = async (roomId: string) => {
  const room = await repository.getRoomById(roomId);

  if (room.isEmpty()) await room.delete();
};
