import * as repository from "../repositories/guessReopository";
import guessWord from "./semantleService";

export const addGuess = async (guess: {
  word: string;
  ownerId: string;
  teamId: string;
}) => {
  const { similarity: score, distance: rank } = await guessWord(guess.word);

  return repository.addGuess({
    ...guess,
    score,
    rank,
    serialNumber:
      (await repository.getGuessesCountByTeam({
        teamId: guess.teamId,
      })) + 1,
  });
};

export const getTeamGuesses = async (teamId: string) =>
  repository.getGuessesByTeam({ teamId, sorted: true });

export const getTeamsTopGuesses = async (teams: string[]) =>
  repository.getTeamsTopGuesses(teams);
