import { Prisma } from "@prisma/client";
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
