import { Prisma } from "@prisma/client";
import * as repository from "../repositories/guessReopository";

export const addGuess = async (guess: Prisma.GuessUncheckedCreateInput) => ({
  ...(await repository.addGuess(guess)),
  serialNumber: await repository.getGuessesCountByTeam({
    teamId: guess.teamId,
  }),
});

export const getAllGuesses = async () => repository.getAllGuesses();

export const getTeamGuesses = async (teamId: string) =>
  repository.getGuessesByTeam({ teamId });
