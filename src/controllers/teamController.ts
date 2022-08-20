import { Router } from "express";
import {
  createTeam,
  getPopulatedTeamById,
  joinTeam,
  leaveTeam,
} from "../services/teamService";

const teamRouter = Router();

teamRouter.post("/", async (req, res) => {
  try {
    const teamId = await createTeam(req.body);
    res.send(teamId);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

teamRouter.get("/:id", async (req, res) => {
  try {
    const team = await getPopulatedTeamById(req.params.id);
    res.send(team);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

teamRouter.patch("/join", async (req, res) => {
  try {
    await joinTeam(req.body);

    res.status(200).send();
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

teamRouter.patch("/leave", async (req, res) => {
  try {
    await leaveTeam(req.body);

    res.status(200).send();
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

export default teamRouter;
