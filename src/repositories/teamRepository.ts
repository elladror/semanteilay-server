import { Prisma } from "@prisma/client";
import prisma from "../db/prisma";

export const createTeam = async (team: Prisma.TeamUncheckedCreateInput) =>
  prisma.team.create({
    data: team,
  });

export const getTeamById = async (
  { id }: Prisma.TeamWhereUniqueInput,
  populated = false
) =>
  prisma.team.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      guesses: populated,
      members: populated,
      room: populated,
    },
  });

export const leaveTeam = async ({
  userId,
  teamId,
}: {
  userId: string;
  teamId: string;
}) =>
  prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      members: {
        disconnect: {
          id: userId,
        },
      },
    },
    select: {
      members: true,
    },
  });

export const deleteTeam = async ({ id }: Prisma.TeamWhereUniqueInput) =>
  prisma.team.delete({
    where: {
      id,
    },
  });

export const joinTeam = async (
  { id: userId }: Prisma.UserWhereUniqueInput,
  { id: teamId }: Prisma.TeamWhereUniqueInput
) => {
  await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      members: {
        connect: {
          id: userId,
        },
      },
    },
  });
};
