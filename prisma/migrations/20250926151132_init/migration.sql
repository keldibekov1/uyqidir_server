-- CreateEnum
CREATE TYPE "public"."AdminRole" AS ENUM ('SUPERADMIN', 'ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "public"."AdType" AS ENUM ('OWNER', 'ROOMMATE');

-- CreateEnum
CREATE TYPE "public"."ForWhom" AS ENUM ('FAMILY', 'FEMALE', 'MALE', 'STUDENT_GIRLS', 'STUDENT_BOYS');

-- CreateEnum
CREATE TYPE "public"."RentType" AS ENUM ('DAILY', 'MONTHLY', 'WEEKLY');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "telegramId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "username" TEXT,
    "photoUrl" TEXT,
    "phoneNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "location" TEXT,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "blockReason" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."AdminRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ad" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UZS',
    "adType" "public"."AdType" NOT NULL,
    "forWhom" "public"."ForWhom" NOT NULL,
    "rentType" "public"."RentType" NOT NULL,
    "currentFloor" INTEGER,
    "totalFloors" INTEGER,
    "address" TEXT,
    "images" TEXT[],
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "conditions" TEXT,
    "totalTenants" INTEGER,
    "availableSpots" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "favoritesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Amenity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdAmenity" (
    "adId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "AdAmenity_pkey" PRIMARY KEY ("adId","amenityId")
);

-- CreateTable
CREATE TABLE "public"."AdLike" (
    "userId" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdLike_pkey" PRIMARY KEY ("userId","adId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "public"."User"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "public"."Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "public"."Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_name_key" ON "public"."Amenity"("name");

-- AddForeignKey
ALTER TABLE "public"."City" ADD CONSTRAINT "City_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "public"."Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ad" ADD CONSTRAINT "Ad_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ad" ADD CONSTRAINT "Ad_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdAmenity" ADD CONSTRAINT "AdAmenity_adId_fkey" FOREIGN KEY ("adId") REFERENCES "public"."Ad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdAmenity" ADD CONSTRAINT "AdAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "public"."Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdLike" ADD CONSTRAINT "AdLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdLike" ADD CONSTRAINT "AdLike_adId_fkey" FOREIGN KEY ("adId") REFERENCES "public"."Ad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
