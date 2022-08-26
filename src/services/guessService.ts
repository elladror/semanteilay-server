import { emitToRoom } from "../socket/utils";
import * as repository from "../repositories/guessReopository";
import guessWord from "./semantleService";

export const addGuess = async (guess: {
  word: string;
  ownerId: string;
  teamId: string;
  roomId: string;
}) => {
  const { similarity: score, distance: rank } = await guessWord(guess.word);

  const addedGuess = await repository.addGuess({
    word: guess.word,
    ownerId: guess.ownerId,
    teamId: guess.teamId,
    score,
    rank,
    serialNumber:
      (await repository.getGuessesCountByTeam({
        teamId: guess.teamId,
      })) + 1,
  });

  const topGuess = await repository.getTeamTopGuess(guess.teamId);

  if (addedGuess.id === topGuess.id)
    emitToRoom({
      event: "topGuessUpdate",
      roomId: guess.roomId,
      payload: { teamId: guess.teamId, topGuess: { score, rank } },
    });

  return addedGuess;
};

export const getTeamGuesses = async (teamId: string) =>
  repository.getGuessesByTeam({ teamId, sorted: true });

export const getTeamsTopGuesses = async (teams: string[]) =>
  repository.getTeamsTopGuesses(teams);
