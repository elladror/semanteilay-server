import { Entity, Schema } from "redis-om";
import client from "../db/redis";
import { fetchTeams } from "./teamRepository";

interface Room {
  name: string;
  teams: string[];
}

class Room extends Entity {
  formatted() {
    return {
      id: this.entityId,
      name: this.name,
      teams: this.teams ?? [],
    };
  }

  async delete() {
    await roomRepository.remove(this.entityId);
  }
  
  isEmpty() {
    return this.teams ? this.teams.length === 0 : true
  }

  async addTeam(teamId: string) {
    this.teams.push(teamId);
    await roomRepository.save(this);
  }

  async removeTeam(teamId: string) {
    this.teams = this.teams.filter(team => team !== teamId)
    await roomRepository.save(this);
  }

  async populate() {
    const { id, name, teams } = this.formatted();
    return {
      id,
      name,
      teams: await fetchTeams(teams),
    };
  }

  static async populated(room: Room) {
    return await room.populate();
  }
}

const schema = new Schema(Room, {
  name: { type: "string" },
  teams: { type: "string[]" },
});

export const roomRepository = client.fetchRepository(schema);

export const getAllRooms = async () =>
  (await roomRepository.search().return.all()).map((room) => room.formatted());

export const populate = async (rooms: Room[]) => await Promise.all(rooms.map(Room.populated));

export const createRoom = async (name: string) =>
  (await roomRepository.createAndSave({ name, teams: [] })).formatted();

export const getRoomById = async (id: string) => await roomRepository.fetch(id);

export const removeTeam = async (teamId: string, roomId: string) => {
  const room = await roomRepository.fetch(roomId);

  if (!room.isEmpty()) await room.removeTeam(teamId);

  return room;
}

export const deleteRoom = async (roomId: string) => await roomRepository.remove(roomId);

export const initialize = async () => {
  await roomRepository.createIndex();
  console.log("room index built");
};

initialize();
