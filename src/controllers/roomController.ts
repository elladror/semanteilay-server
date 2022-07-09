import { getAllRooms, createRoom, getPopulatedRoomById } from "../services/roomService";
import { Router } from "express";

export const router = Router();

router.post("/", async (req, res) => {
  try {
    const room = await createRoom(req.body.roomName);
    res.send(room);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const room = await getPopulatedRoomById(req.params.id);
    res.send(room);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("", async (req, res) => {
  try {
    const rooms = await getAllRooms();
    res.send(rooms);
  } catch (err) {
    res.status(500).send(err);
  }
});
