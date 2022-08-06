import * as repository from "../repositories/guessReopository";
import guessWord from "./semantleService";

export const addGuess = async (guess: {
  word: string;
  ownerId: string;
  teamId: string;
}) => {
  const { similarity: score, distance: rank } = await guessWord(guess.word);

  return {
    ...(await repository.addGuess({ ...guess, score, rank })),
    serialNumber: await repository.getGuessesCountByTeam({
      teamId: guess.teamId,
    }),
  };
};

export const getAllGuesses = async () => repository.getAllGuesses();

export const getTeamGuesses = async (teamId: string) =>
  repository.getGuessesByTeam({ teamId });
