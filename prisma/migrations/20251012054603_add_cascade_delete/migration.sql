-- DropForeignKey
ALTER TABLE "public"."AdLike" DROP CONSTRAINT "AdLike_adId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_adId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RecentActivity" DROP CONSTRAINT "RecentActivity_adId_fkey";

-- AddForeignKey
ALTER TABLE "public"."AdLike" ADD CONSTRAINT "AdLike_adId_fkey" FOREIGN KEY ("adId") REFERENCES "public"."Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_adId_fkey" FOREIGN KEY ("adId") REFERENCES "public"."Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecentActivity" ADD CONSTRAINT "RecentActivity_adId_fkey" FOREIGN KEY ("adId") REFERENCES "public"."Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;
