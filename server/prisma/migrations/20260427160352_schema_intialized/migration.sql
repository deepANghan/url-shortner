-- CreateTable
CREATE TABLE "urls" (
    "urlId" SERIAL NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "shortenUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "urls_pkey" PRIMARY KEY ("urlId")
);
