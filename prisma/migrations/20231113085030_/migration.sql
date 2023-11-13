/*
  Warnings:

  - A unique constraint covering the columns `[calendarId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `calendarId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "calendarId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Message_calendarId_key" ON "Message"("calendarId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
