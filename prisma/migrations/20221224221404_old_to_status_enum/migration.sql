-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'OLD';

-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
