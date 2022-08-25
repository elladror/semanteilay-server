/*
  Warnings:

  - A unique constraint covering the columns `[word,teamId]` on the table `Guess` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ownerId` on table `Guess` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Guess" ALTER COLUMN "ownerId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Guess_word_teamId_key" ON "Guess"("word", "teamId");
