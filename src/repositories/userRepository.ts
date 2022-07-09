import { Entity, Schema } from "redis-om";
import client from "../db/redis";

interface User {
  name: string;
}

class User extends Entity {
  static formatted(user: User) {
    return {
      name: user.name,
      id: user.entityId,
    };
  }
}

const schema = new Schema(User, {
  name: { type: "string" },
});

const userRepository = client.fetchRepository(schema);

export const getUserById = async (userId: string) => await userRepository.fetch(userId);

export const isNameTaken = async (userName: string) => (await userRepository.search().where("name").equals(userName).return.count()) !== 0

export const getAllUsers = async () => await userRepository.search().all();

export const createUser = async (userName: string) => await userRepository.createAndSave({ name: userName });

export const fetchUsers = async (userIds: string[]) => {
  const users = await Promise.all(userIds.map((userId) => userRepository.fetch(userId)));
  return users.map(User.formatted);
};

export const deleteUser = async (userId: string) => await userRepository.remove(userId);

export const initialize = async () => {
  await userRepository.createIndex();
  console.log("user index built");
};

initialize();
