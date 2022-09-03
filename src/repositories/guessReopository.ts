import { Prisma } from "@prisma/client";
import prisma from "../db/prisma";

export const addGuess = async (guess: Prisma.GuessUncheckedCreateInput) => {
  try {
    return await prisma.guess.create({
      data: guess,
      include: { owner: { select: { name: true } } },
    });
  } catch (error) {
    throw error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
      ? new Error("guess already exists")
      : error;
  }
};

export const getGuessesByTeam = async ({
  teamId,
  sorted,
}: Prisma.GuessWhereInput & { sorted?: boolean }) =>
  prisma.guess.findMany({
    where: {
      teamId,
    },
    orderBy: sorted
      ? {
          score: "desc",
        }
      : {},
    include: { owner: { select: { name: true } } },
  });

export const getGuessesCountByTeam = async ({
  teamId,
}: Prisma.GuessWhereInput) =>
  prisma.guess.count({
    where: {
      teamId,
    },
  });

export const getTeamsTopGuesses = async (teams: string[]) =>
  prisma.guess.groupBy({
    by: ["teamId"],
    where: {
      teamId: {
        in: teams,
      },
    },
    _max: {
      score: true,
      rank: true,
    },
    orderBy: {
      _max: {
        score: "desc",
      },
    },
  });

export const getTeamTopGuess = async (teamId: string) =>
  (
    await prisma.guess.findMany({
      where: {
        teamId,
      },
      orderBy: {
        score: "desc",
      },
      take: 1,
    })
  )[0];
