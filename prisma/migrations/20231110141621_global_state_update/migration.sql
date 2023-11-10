/*
  Warnings:

  - You are about to drop the column `showModel` on the `GlobalState` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GlobalState" DROP COLUMN "showModel",
ADD COLUMN     "commentBoxShow" BOOLEAN DEFAULT true;
