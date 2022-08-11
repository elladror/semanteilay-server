import "dotenv/config";
import express, { Request, Response } from "express";
import * as http from "http";
import cors from "cors";
import socket from "./socket/socket";
import userRouter from "./controllers/userController";
import roomRouter from "./controllers/roomController";
import teamRouter from "./controllers/teamController";
import guessRouter from "./controllers/guessController";
import corsOptions from "./utils/cors/corsOptions";

const app = express();
app.use(express.json());

app.use(cors(corsOptions));
const server = http.createServer(app);

socket(server);

app.use("/users", userRouter);
app.use("/rooms", roomRouter);
app.use("/teams", teamRouter);
app.use("/guesses", guessRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

server.listen(process.env.PORT, () => {
  console.log(`⚡️ Server running on http://localhost:${process.env.PORT}`);
});
