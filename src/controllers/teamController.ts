import { Router } from "express";
import {
  changeTeam,
  createTeam,
  getPopulatedTeamById,
} from "../services/teamService";

const teamRouter = Router();

teamRouter.post("/", async (req, res) => {
  try {
    const team = await createTeam(req.body);
    res.send(team.id);
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

teamRouter.patch("", async (req, res) => {
  try {
    const { userId, teamId, oldTeamId } = req.body;
    await changeTeam(userId, teamId, oldTeamId);

    res.status(200).send();
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

export default teamRouter;
