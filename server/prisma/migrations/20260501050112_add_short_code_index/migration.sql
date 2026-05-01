/*
  Warnings:

  - A unique constraint covering the columns `[shortenUrl]` on the table `urls` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "urls_shortenUrl_key" ON "urls"("shortenUrl");
