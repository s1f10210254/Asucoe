/*
  Warnings:

  - You are about to drop the column `authenticationId` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `authenticationId` on the `GlobalState` table. All the data in the column will be lost.
  - You are about to drop the column `authenticationId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `authenticationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Authentication` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Calendar" DROP CONSTRAINT "Calendar_authenticationId_fkey";

-- DropForeignKey
ALTER TABLE "GlobalState" DROP CONSTRAINT "GlobalState_authenticationId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_authenticationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_authenticationId_fkey";

-- AlterTable
ALTER TABLE "Calendar" DROP COLUMN "authenticationId";

-- AlterTable
ALTER TABLE "GlobalState" DROP COLUMN "authenticationId";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "authenticationId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "authenticationId";

-- DropTable
DROP TABLE "Authentication";
