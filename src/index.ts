import "dotenv/config";
import express, { Request, Response } from "express";
import * as http from "http";
import * as socket from "./socket/socket.js";
import { router as userRouter } from "./controllers/userController";
import { router as roomRouter } from "./controllers/roomController";
import { router as teamRouter} from "./controllers/teamController";
import { router as guessRouter } from "./controllers/guessController"
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}))
const server = http.createServer(app);

socket.init(server);

app.use("/users", userRouter);
app.use("/rooms", roomRouter);
app.use("/teams", teamRouter)
app.use("/guesses", guessRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

server.listen(process.env.PORT, () => {
  console.log(`⚡️ Server running on http://localhost:${process.env.PORT}`);
});
