-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- CreateTable
CREATE TABLE "PackageReservation" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'pending',
    "travelDate" TIMESTAMP(3) NOT NULL,
    "paxCount" INTEGER NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT,
    "message" TEXT,
    "totalNet" DOUBLE PRECISION,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageReservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PackageReservation" ADD CONSTRAINT "PackageReservation_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageReservation" ADD CONSTRAINT "PackageReservation_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "WholesalePackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
