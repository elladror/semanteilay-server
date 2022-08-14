import { Prisma } from "@prisma/client";
import prisma from "../db/prisma";

export const addGuess = async (guess: Prisma.GuessUncheckedCreateInput) =>
  prisma.guess.create({ data: guess });

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
