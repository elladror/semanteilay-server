import { emitToRoom } from "../socket/utils";
import * as repository from "../repositories/teamRepository";

export const getPopulatedTeamById = async (id: string) =>
  repository.getTeamById({ id }, true);

interface CreateTeamParams {
  name: string;
  userId: string;
  roomId: string;
}

export const createTeam = async ({ name, userId, roomId }: CreateTeamParams) =>
  repository.createTeam({
    name,
    roomId,
    members: {
      connect: {
        id: userId,
      },
    },
  });
export const leaveTeam = async ({
  userId,
  roomId,
  teamId,
}: {
  userId: string;
  teamId: string;
  roomId?: string;
}) => {
  const team = await repository.leaveTeam({ userId, teamId });

  if (team.members.length === 0) {
    const deletedTeamRoomId =
      roomId ?? (await getPopulatedTeamById(teamId)).roomId;
    await repository.deleteTeam({ id: teamId });

    emitToRoom({
      event: "teamDeleted",
      roomId: deletedTeamRoomId,
      payload: { teamId },
    });
  }
};

export const joinTeam = async (userId: string, teamId: string) => {
  await repository.joinTeam({ id: userId }, { id: teamId });
};

export const changeTeam = async (
  userId: string,
  teamId: string,
  oldTeamId?: string
) => {
  if (oldTeamId) await leaveTeam({ userId, teamId: oldTeamId });

  await joinTeam(userId, teamId);
};
