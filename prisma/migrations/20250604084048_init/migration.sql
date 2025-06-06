/*
  Warnings:

  - You are about to drop the `NFT` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_nFTTokenId_fkey";

-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_accountId_fkey";

-- DropTable
DROP TABLE "NFT";

-- CreateTable
CREATE TABLE "nfts" (
    "id" SERIAL NOT NULL,
    "tokenId" TEXT NOT NULL,
    "seller" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "sold" BOOLEAN NOT NULL,
    "tokenURI" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "properties" JSONB,
    "accountId" INTEGER,
    "accountAddress" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nfts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nfts_tokenId_key" ON "nfts"("tokenId");

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_nFTTokenId_fkey" FOREIGN KEY ("nFTTokenId") REFERENCES "nfts"("tokenId") ON DELETE SET NULL ON UPDATE CASCADE;
