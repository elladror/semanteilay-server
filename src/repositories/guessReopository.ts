import { Prisma } from "@prisma/client";
import prisma from "../db/prisma";

export const addGuess = async (guess: Prisma.GuessUncheckedCreateInput) =>
  prisma.guess.create({ data: guess });

export const getAllGuesses = async () => prisma.guess.findMany();

export const getGuessesByTeam = async ({ teamId }: Prisma.GuessWhereInput) =>
  prisma.guess.findMany({
    where: {
      teamId,
    },
  });

export const getGuessesCountByTeam = async ({
  teamId,
}: Prisma.GuessWhereInput) =>
  prisma.guess.count({
    where: {
      teamId,
    },
  });
