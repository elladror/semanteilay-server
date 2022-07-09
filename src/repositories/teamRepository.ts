import { Entity, Schema } from "redis-om";
import client from "../db/redis";
import { fetchUsers } from "./userRepository";

interface Team {
  name: string;
  members: string[];
}

class Team extends Entity {
  formatted() {
    return {
      id: this.entityId,
      name: this.name,
      members: this.members ?? [],
    };
  }

  isEmpty() {
    return this.members.length === 0;
  }

  async populate() {
    const { id, name, members } = this.formatted();
    return {
      id,
      name,
      members: await fetchUsers(members),
    };
  }

  async removeMember(userId: string) {
    this.members = this.members.filter((member) => member !== userId);
    await teamRepository.save(this);
  }

  async addMember(userId: string) {
    this.members.push(userId);
    await teamRepository.save(this);
  }

  static async populated(team: Team) {
    return team.populate();
  }
}

const schema = new Schema(Team, {
  members: { type: "string[]" },
  name: { type: "string" },
}, {
  dataStructure: 'HASH'
});

export const teamRepository = client.fetchRepository(schema);

export const fetchTeams = async (teamsIds: string[]) => {
  const teams = await Promise.all(teamsIds.map((teamId) => teamRepository.fetch(teamId)));
  return await Promise.all(teams.map(Team.populated));
};

export const createTeam = async (name: string, createdBy: string) =>
  await Team.populated(await teamRepository.createAndSave({ name, members: [createdBy] }));

export const getAllTeams = async () => await teamRepository.search().returnAll();

export const getTeamById = async (id: string) =>
  await Team.populated(await teamRepository.fetch(id));

export const leaveTeam = async (userId: string, teamId: string) => {
  const team = await teamRepository.fetch(teamId);
  await team.removeMember(userId);

  return team;
};

export const deleteTeam = async (teamId: string) => await teamRepository.remove(teamId);

export const joinTeam = async (userId: string, teamId: string) => {
  const team = await teamRepository.fetch(teamId);
  await team.addMember(userId);
};

export const getTeamByUser = async (userId: string) =>  await teamRepository.search().where('members').contain(userId).returnFirst();

export const initialize = async () => {
  await teamRepository.createIndex();
  console.log("team index built");
};

initialize();
