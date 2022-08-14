import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const TEAM_PREFIX = "#team: ";
const ROOM_PREFIX = "#room: ";

export const asSocketTeamId = (teamId: string) => TEAM_PREFIX + teamId;
export const asTeamId = (socketTeamId: string) =>
  socketTeamId.replace(TEAM_PREFIX, "");

export const asSocketRoomId = (roomId: string) => ROOM_PREFIX + roomId;
export const asRoomId = (socketRoomId: string) =>
  socketRoomId.replace(ROOM_PREFIX, "");

export const isTeam = (roomId: string) => roomId.includes(TEAM_PREFIX);
export const isRoom = (roomId: string) => roomId.includes(ROOM_PREFIX);

let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export const injectIO = (
  injectedIO: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io = injectedIO;
};

export const hookSocketWithUser = async (userId: string, socketId: string) => {
  (await io.in(socketId).fetchSockets())[0].data.userId = userId;
};

export const emitRoomDeleted = () => {
  io.to("lobby").emit("roomsUpdated");
};

export const emitToRoom = ({
  event,
  roomId,
  payload,
}: {
  event: string;
  roomId: string;
  payload?: {};
}) => {
  io.of("/").to(asSocketRoomId(roomId)).emit(event, payload);
};
