import { addGuess, getAllGuesses, getTeamGuesses } from "../services/guessService";
import { Router } from "express";

export const router = Router();

router.post("/", async (req, res) => {
  try {
    const guess = await addGuess(req.body);
    res.send(guess);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const guesses = await getAllGuesses();
    res.send(guesses);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const guesses = await getTeamGuesses(req.params.id);
    res.send(guesses);
  } catch (err) {
    res.status(500).send(err);
  }
});
