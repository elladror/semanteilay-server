import { Router } from "express";
import {
  getUserById,
  joinRoom,
  leaveRoom,
  login,
  setIdle,
  signUp,
} from "../services/userService";

const userRouter = Router();

userRouter.post("/", async (req, res) => {
  try {
    const id = await signUp(req.body.name, req.body.socketId);
    res.send({ id });
  } catch (err) {
    res.status(409).send((err as Error).message);
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

userRouter.patch("/", async (req, res) => {
  try {
    const user = await login(req.body);
    res.send(user);
  } catch (err) {
    const status = (err as Error).message === "user not found" ? 404 : 500;

    res.status(status).send((err as Error).message);
  }
});

userRouter.patch("/idle", async (req, res) => {
  try {
    const user = await setIdle(req.body.userId);
    res.send(user);
  } catch (err) {
    const status = (err as Error).message === "user not found" ? 404 : 500;

    res.status(status).send((err as Error).message);
  }
});

userRouter.patch("/leaveRoom", async (req, res) => {
  try {
    const user = await leaveRoom(req.body);
    res.send(user);
  } catch (err) {
    const status = (err as Error).message === "user not found" ? 404 : 500;

    res.status(status).send((err as Error).message);
  }
});

userRouter.patch("/joinRoom", async (req, res) => {
  try {
    const user = await joinRoom(req.body);
    res.send(user);
  } catch (err) {
    const { message } = err as Error;
    const status =
      message === "user not found" || message === "no such room" ? 404 : 500;

    res.status(status).send((err as Error).message);
  }
});

export default userRouter;
