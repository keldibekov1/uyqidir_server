-- DropForeignKey
ALTER TABLE "public"."AdView" DROP CONSTRAINT "AdView_adId_fkey";

-- AddForeignKey
ALTER TABLE "public"."AdView" ADD CONSTRAINT "AdView_adId_fkey" FOREIGN KEY ("adId") REFERENCES "public"."Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;
