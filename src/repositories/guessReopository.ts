import { Prisma } from "@prisma/client";
import prisma from "../db/prisma";

export const addGuess = async (guess: Prisma.GuessUncheckedCreateInput) =>
  prisma.guess.create({ data: guess, select: {} });

export const getAllGuesses = async () => prisma.guess.findMany();

export const getGuessesByTeam = async (teamId: string) =>
  prisma.guess.findMany({
    where: {
      teamId,
    },
  });

export const getGuessesCountByTeam = async (teamId: string) =>
  prisma.guess.count({
    where: {
      teamId,
    },
  });
