/*
  Warnings:

  - The `status` column on the `Ad` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."AdStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."Ad" DROP COLUMN "status",
ADD COLUMN     "status" "public"."AdStatus" NOT NULL DEFAULT 'PENDING';
