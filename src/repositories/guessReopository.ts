import { Entity, Schema } from 'redis-om'
import client from "../db/redis";
import guess from "../models/guess"
interface Guess extends guess {}
class Guess extends Entity {
    formatted() {
        return {
          word: this.word,
          score: this.score,
          rank: this.rank,
          owner: this.owner,
          team: this.team
        };
      }
}

const schema = new Schema(
    Guess, {
        word: { type: 'string' },
        score: { type: 'number'},
        rank: {type: 'number'},
        owner: {type: 'string'},
        team: {type: 'string'}
    },
) 

export const guessRepository = client.fetchRepository(schema);

export const addGuess = async ({word, score, rank, owner, team}: guess) => await guessRepository.createAndSave({word, score, rank, owner, team})

export const initialize = async () => {
    await guessRepository.createIndex();
    console.log("guess index built");
};

initialize();

export const getAllGuesses = async () => await guessRepository.search().returnAll();

export const getTeamGuesses = async (teamId: string) => await guessRepository.search().where('team').equals(teamId).returnAll();
