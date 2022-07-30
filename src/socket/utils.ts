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
