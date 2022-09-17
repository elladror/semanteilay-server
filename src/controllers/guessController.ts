import { Router } from "express";
import { addGuess, getTeamGuesses } from "../services/guessService";

const guessRouter = Router();

guessRouter.post("/", async (req, res) => {
  try {
    const guess = await addGuess(req.body);
    res.send(guess);
  } catch (err) {
    const { message } = err as Error;

    let status: number;

    switch (message) {
      case "guess already exists":
        status = 409;
        break;
      case "unknown word":
        status = 406;
        break;
      default:
        status = 500;
        break;
    }

    res.status(status).send(message);
  }
});

guessRouter.get("/:id", async (req, res) => {
  try {
    const guesses = await getTeamGuesses(req.params.id);
    res.send(guesses);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

export default guessRouter;
