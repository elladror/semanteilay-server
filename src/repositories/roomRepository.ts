import { Prisma } from "@prisma/client";
import prisma from "../db/prisma";

export const getAllRooms = async () => prisma.room.findMany();

export const createRoom = async ({ name }: Prisma.RoomCreateInput) =>
  prisma.room.create({ data: { name } });

export const getRoomById = async (
  { id }: Prisma.RoomWhereUniqueInput,
  populated = false
) =>
  prisma.room.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      teams: populated,
    },
  });

export const deleteRoom = async ({ id }: Prisma.RoomWhereUniqueInput) =>
  prisma.room.delete({
    where: {
      id,
    },
  });
