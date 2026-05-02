-- CreateTable
CREATE TABLE "analytics" (
    "aId" SERIAL NOT NULL,
    "urlId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("aId")
);

-- CreateIndex
CREATE UNIQUE INDEX "analytics_urlId_key" ON "analytics"("urlId");

-- AddForeignKey
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "urls"("urlId") ON DELETE RESTRICT ON UPDATE CASCADE;
