import { Router } from "express";
import { getUserById, signUp } from "../services/userService";

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

export default userRouter;
