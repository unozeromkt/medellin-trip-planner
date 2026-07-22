-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('bancolombia', 'nequi', 'llave', 'pse');

-- AlterTable
ALTER TABLE "PackageReservation" ADD COLUMN     "paymentMethod" "PaymentMethod",
ADD COLUMN     "paymentProofUrl" TEXT,
ADD COLUMN     "paymentRef" TEXT;

-- CreateTable
CREATE TABLE "Passenger" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "isLeader" BOOLEAN NOT NULL DEFAULT false,
    "phoneCountryCode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Passenger_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Passenger" ADD CONSTRAINT "Passenger_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "PackageReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
