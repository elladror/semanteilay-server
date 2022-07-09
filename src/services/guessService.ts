import Guess from "../models/guess";
import * as repository from "../repositories/guessReopository";

export const addGuess = async (guess: Guess) => {
  const newGuess = (await repository.addGuess(guess)).formatted();
  const guessNumber = (await getTeamGuesses(guess.team)).length + 1;
  
  return {...newGuess, serialNumber: guessNumber}
};

export const getAllGuesses = async () =>
  (await repository.getAllGuesses()).map((guess) => guess.formatted());

export const getTeamGuesses = async (teamId: string) =>
  (await repository.getTeamGuesses(teamId)).map((guess) => guess.formatted());
