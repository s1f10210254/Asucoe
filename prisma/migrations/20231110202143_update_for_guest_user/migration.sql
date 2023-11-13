/*
  Warnings:

  - Added the required column `authenticationId` to the `GlobalState` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GlobalState" ADD COLUMN     "authenticationId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Authentication" (
    "id" SERIAL NOT NULL,
    "isGuest" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Authentication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "authenticationId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "counseling" TEXT DEFAULT '',
    "authenticationId" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "emotionalValue" INTEGER NOT NULL,
    "authenticationId" INTEGER NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_authenticationId_fkey" FOREIGN KEY ("authenticationId") REFERENCES "Authentication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authenticationId_fkey" FOREIGN KEY ("authenticationId") REFERENCES "Authentication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_authenticationId_fkey" FOREIGN KEY ("authenticationId") REFERENCES "Authentication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalState" ADD CONSTRAINT "GlobalState_authenticationId_fkey" FOREIGN KEY ("authenticationId") REFERENCES "Authentication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
