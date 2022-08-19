-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'IDLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
