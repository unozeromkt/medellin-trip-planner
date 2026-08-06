-- CreateEnum
CREATE TYPE "TourOrderStatus" AS ENUM ('pending', 'approved', 'declined', 'voided', 'error');

-- CreateTable
CREATE TABLE "TourOrder" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "status" "TourOrderStatus" NOT NULL DEFAULT 'pending',
    "amountInCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'COP',
    "travelDate" TIMESTAMP(3),
    "peopleCount" INTEGER,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT,
    "contactDocument" TEXT,
    "pickup" TEXT,
    "message" TEXT,
    "pageUrl" TEXT,
    "wompiTransactionId" TEXT,
    "wompiPaymentMethod" TEXT,
    "paidAt" TIMESTAMP(3),
    "confirmationEmailSentAt" TIMESTAMP(3),
    "ghlSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TourOrder_reference_key" ON "TourOrder"("reference");

-- AddForeignKey
ALTER TABLE "TourOrder" ADD CONSTRAINT "TourOrder_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
