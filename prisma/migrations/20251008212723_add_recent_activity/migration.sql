-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('NEW_AD', 'AD_APPROVED', 'AD_REJECTED', 'NEW_COMMENT', 'NEW_USER', 'USER_BLOCKED', 'USER_UNBLOCKED');

-- CreateTable
CREATE TABLE "public"."RecentActivity" (
    "id" TEXT NOT NULL,
    "type" "public"."ActivityType" NOT NULL,
    "userId" TEXT NOT NULL,
    "adId" TEXT,
    "commentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."RecentActivity" ADD CONSTRAINT "RecentActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecentActivity" ADD CONSTRAINT "RecentActivity_adId_fkey" FOREIGN KEY ("adId") REFERENCES "public"."Ad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecentActivity" ADD CONSTRAINT "RecentActivity_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
