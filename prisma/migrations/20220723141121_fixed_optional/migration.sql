/*
  Warnings:

  - A unique constraint covering the columns `[name,roomId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teamId` to the `Guess` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_ownerId_fkey";

-- AlterTable
ALTER TABLE "Guess" ADD COLUMN     "teamId" TEXT NOT NULL,
ALTER COLUMN "ownerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "teamId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_roomId_key" ON "Team"("name", "roomId");

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
