/*
  Warnings:

  - Added the required column `category` to the `NFT` table without a default value. This is not possible if the table is not empty.

*/
-- First add the column as nullable
ALTER TABLE "NFT" ADD COLUMN "category" TEXT;

-- Update existing rows with default value
UPDATE "NFT" SET "category" = 'art' WHERE "category" IS NULL;

-- Make the column non-nullable with default value
ALTER TABLE "NFT" ALTER COLUMN "category" SET NOT NULL;
ALTER TABLE "NFT" ALTER COLUMN "category" SET DEFAULT 'art';
