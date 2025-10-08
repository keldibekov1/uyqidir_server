-- DropForeignKey
ALTER TABLE "public"."AdAmenity" DROP CONSTRAINT "AdAmenity_adId_fkey";

-- AddForeignKey
ALTER TABLE "public"."AdAmenity" ADD CONSTRAINT "AdAmenity_adId_fkey" FOREIGN KEY ("adId") REFERENCES "public"."Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;
