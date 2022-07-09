import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  signUp,
  leaveRoom,
} from "../services/userService";

export const router = Router();

router.post("/", async (req, res) => {
  try {
    const id = await signUp(req.body.name, req.body.socketId);
    res.send({ id });
  } catch (err) {
    res.status(409).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/room", async (req, res) => {
  try {
    await leaveRoom(req.body.userId, req.body.roomId);
    res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
});
