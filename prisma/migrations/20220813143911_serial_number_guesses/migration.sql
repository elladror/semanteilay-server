/*
  Warnings:

  - Added the required column `serialNumber` to the `Guess` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guess" ADD COLUMN     "serialNumber" INTEGER NOT NULL;
