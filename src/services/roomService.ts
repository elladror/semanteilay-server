import { emitRoomDeleted } from "../socket/utils";
import * as repository from "../repositories/roomRepository";
import { getTeamsTopGuesses } from "./guessService";

export const createRoom = async (name: string) =>
  repository.createRoom({ name });

export const getAllRooms = async () => repository.getAllRooms();

export const getPopulatedRoomById = async (id: string) => {
  const room = await repository.getRoomById({ id });

  const topGuesses = await getTeamsTopGuesses(
    room.teams.map((team) => team.id)
  );

  const teamsWithoutGuesses = room.teams.filter(
    (team) => !topGuesses.map((guess) => guess.teamId).includes(team.id)
  );

  const allGuesses = [
    ...topGuesses,
    ...teamsWithoutGuesses.map((team) => ({
      teamId: team.id,
      _max: { score: 0, rank: -1 },
    })),
  ];

  const teamsWithGuesses = allGuesses.map((guess) => ({
    ...room.teams.find((team) => team.id === guess.teamId),
    // eslint-disable-next-line no-underscore-dangle
    topGuess: guess._max,
  }));

  return { ...room, teams: teamsWithGuesses };
};
export const deleteRoomIfEmpty = async (roomId: string) => {
  const room = await repository.getRoomById({ id: roomId });

  if (room.teams.length === 0) {
    await repository.deleteRoom({ id: roomId });
    emitRoomDeleted();
  }
};
