import { emitToRoom } from "../socket/utils";
import * as repository from "../repositories/teamRepository";
import * as userRepository from "./userService";

export const getPopulatedTeamById = async (id: string) =>
  repository.getTeamById({ id }, true);

export const joinTeam = async ({
  userId,
  teamId,
  roomId,
}: {
  userId: string;
  teamId: string;
  roomId: string;
}) => {
  await repository.joinTeam({ id: userId }, { id: teamId });
  await userRepository.joinTeam({ userId, teamId });
  emitToRoom({ event: "participantUpdate", roomId });
};

export const leaveTeam = async ({
  userId,
  roomId,
  teamId,
}: {
  userId: string;
  teamId: string;
  roomId: string;
}) => {
  const team = await repository.leaveTeam({ userId, teamId });
  await repository.leaveTeam({ userId, teamId });
  emitToRoom({ event: "participantUpdate", roomId });

  if (team.members.length === 0) {
    // TODO: consider adding delay to team deletion after play leaves it
    const deletedTeamRoomId =
      roomId ?? (await repository.getTeamById({ id: teamId })).roomId;
    await repository.deleteTeam({ id: teamId });

    emitToRoom({
      event: "teamDeleted",
      roomId: deletedTeamRoomId,
      payload: { teamId },
    });
  }
};

interface CreateTeamParams {
  name: string;
  userId: string;
  roomId: string;
}

export const createTeam = async ({
  name,
  userId,
  roomId,
}: CreateTeamParams) => {
  const teamsWithThisNameInRoom = await repository.TeamsWithThisNameInRoom({
    roomId,
    name,
  });

  const { id } = await repository.createTeam({
    name:
      teamsWithThisNameInRoom === 0
        ? name
        : `${name} (${teamsWithThisNameInRoom})`,
    roomId,
    members: {
      connect: {
        id: userId,
      },
    },
  });

  await joinTeam({ userId, teamId: id, roomId });

  emitToRoom({
    event: "participantUpdate",
    roomId,
  });

  return id;
};
