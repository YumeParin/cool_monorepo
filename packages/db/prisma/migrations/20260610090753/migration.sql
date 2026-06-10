/*
  Warnings:

  - A unique constraint covering the columns `[discordId]` on the table `Server` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Server_discordId_key" ON "Server"("discordId");
