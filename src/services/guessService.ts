import { Prisma } from "@prisma/client";
import * as repository from "../repositories/guessReopository";

export const addGuess = async (guess: Prisma.GuessUncheckedCreateInput) => {
  const newGuess = await repository.addGuess(guess);
  const guessNumber =
    (await repository.getGuessesCountByTeam({ teamId: guess.teamId })) + 1;

  return { ...newGuess, serialNumber: guessNumber };
};

export const getAllGuesses = async () => repository.getAllGuesses();

export const getTeamGuesses = async (teamId: string) =>
  repository.getGuessesByTeam({ teamId });
