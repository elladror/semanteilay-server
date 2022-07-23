import { Router } from "express";
import {
  getAllRooms,
  createRoom,
  getPopulatedRoomById,
} from "../services/roomService";

const roomRouter = Router();

roomRouter.post("/", async (req, res) => {
  try {
    const room = await createRoom(req.body.roomName);
    res.send(room);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

roomRouter.get("/:id", async (req, res) => {
  try {
    const room = await getPopulatedRoomById(req.params.id);
    res.send(room);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

roomRouter.get("", async (req, res) => {
  try {
    const rooms = await getAllRooms();
    res.send(rooms);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

export default roomRouter;
