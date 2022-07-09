import * as repository from "../repositories/teamRepository";
import { addTeamToRoom, removeTeamFromRoom } from "./roomService";

export const getTeamById = async (id: string) => await repository.getTeamById(id);

interface CreateTeamParams {
  name: string;
  userId: string;
  roomId: string;
}

export const createTeam = async ({ name, userId, roomId }: CreateTeamParams) => {
  const team = await repository.createTeam(name, userId);
  await addTeamToRoom(roomId, team.id);

  return team;
};

export const leaveTeam = async (userId: string, roomId: string, teamId?: string) => {
  teamId = teamId ?? (await getTeamByUser(userId)).entityId;
  const team = await repository.leaveTeam(userId, teamId);

  if (team.isEmpty()) {
    await removeTeamFromRoom(roomId, teamId);
    await repository.deleteTeam(teamId);
  }
};

export const joinTeam = async (userId: string, teamId: string) => {
  await repository.joinTeam(userId, teamId);
};

export const getTeamByUser = async (userId: string) => await repository.getTeamByUser(userId);

export const changeTeam = async (userId: string, teamId: string, roomdId: string) => {
  const oldTeam = await getTeamByUser(userId);
  if (oldTeam && oldTeam.entityId !== teamId) await leaveTeam(userId, roomdId, oldTeam.entityId); // TODO: maybe fix band-aid looking code

  await joinTeam(userId, teamId);
};

export const getAllTeams = async () => await repository.getAllTeams();
