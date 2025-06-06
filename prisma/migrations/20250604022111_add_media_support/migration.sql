/*
  Warnings:

  - You are about to drop the column `image` on the `NFT` table. All the data in the column will be lost.
  - Added the required column `mediaType` to the `NFT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaUrl` to the `NFT` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NFT" DROP COLUMN "image",
ADD COLUMN     "mediaType" TEXT NOT NULL,
ADD COLUMN     "mediaUrl" TEXT NOT NULL,
ADD COLUMN     "properties" JSONB,
ADD COLUMN     "thumbnailUrl" TEXT;
