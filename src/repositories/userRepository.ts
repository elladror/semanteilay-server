import { Prisma, User } from "@prisma/client";
import prisma from "../db/prisma";

export const getUserById = async ({ id }: Prisma.UserWhereUniqueInput) =>
  prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

export const isNameTaken = async ({ name }: Prisma.UserWhereUniqueInput) => {
  const user = await prisma.user.findUnique({
    where: {
      name,
    },
  });

  return !!user;
};

export const createUser = async ({ name }: Prisma.UserCreateInput) =>
  prisma.user.create({ data: { name } });

export const deleteUser = async ({ id }: Prisma.UserWhereUniqueInput) =>
  prisma.user.delete({ where: { id } });

const updateCallWrapper = async (wrapped: Promise<User>) => {
  try {
    return await wrapped;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") throw new Error("user not found");
      if (error.code === "P2003" && error.message.includes("roomId"))
        throw new Error("no such room");
    }

    throw error;
  }
};

export const login = async ({ id }: Prisma.UserWhereUniqueInput) =>
  updateCallWrapper(
    prisma.user.update({
      where: { id },
      data: {
        status: "ACTIVE",
      },
    })
  );

export const setIdle = async ({ id }: Prisma.UserWhereUniqueInput) =>
  updateCallWrapper(
    prisma.user.update({
      where: { id },
      data: {
        status: "IDLE",
      },
    })
  );

export const leaveRoom = async ({ id }: Prisma.UserWhereUniqueInput) =>
  updateCallWrapper(
    prisma.user.update({
      where: { id },
      data: {
        roomId: null,
      },
    })
  );

export const joinRoom = async ({
  userId,
  roomId,
}: {
  userId: string;
  roomId: string;
}) =>
  updateCallWrapper(
    prisma.user.update({
      where: { id: userId },
      data: {
        roomId,
      },
    })
  );

export const userCountInRoom = async (roomId: string) =>
  prisma.user.count({
    where: {
      roomId,
    },
  });

export const joinTeam = async ({
  userId,
  teamId,
}: {
  userId: string;
  teamId: string;
}) =>
  updateCallWrapper(
    prisma.user.update({
      where: { id: userId },
      data: {
        teamId,
      },
    })
  );

export const leaveTeam = async ({ userId }: { userId: string }) =>
  updateCallWrapper(
    prisma.user.update({
      where: { id: userId },
      data: {
        teamId: null,
      },
    })
  );
