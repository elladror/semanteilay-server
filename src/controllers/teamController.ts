import { Router } from "express";
import { getTeamByUser } from "../repositories/teamRepository";
import {
  changeTeam,
  createTeam,
  getAllTeams,
  getTeamById,
  leaveTeam,
} from "../services/teamService";

export const router = Router();

router.post("/", async (req, res) => {
  try {
    const team = await createTeam(req.body);
    res.send(team.id);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const team = await getTeamById(req.params.id);
    res.send(team);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("", async (req, res) => {
  try {
    const teams = await getAllTeams();
    res.send(teams);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("", async (req, res) => {
  try {
    const { userId, teamId, roomId } = req.body;
    await changeTeam(userId, teamId, roomId);
  
    res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
});
