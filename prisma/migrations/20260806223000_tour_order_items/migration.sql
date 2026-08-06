-- CreateTable
CREATE TABLE "TourOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "priceSnapshot" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TourOrderItem_pkey" PRIMARY KEY ("id")
);

-- Backfill existing single-tour orders (sandbox test data) into line items,
-- using the old peopleCount as the item quantity multiplier.
INSERT INTO "TourOrderItem" ("id", "orderId", "tourId", "quantity", "createdAt")
SELECT md5(random()::text || clock_timestamp()::text || "id"), "id", "tourId", COALESCE("peopleCount", 1), "createdAt"
FROM "TourOrder";

-- DropForeignKey
ALTER TABLE "TourOrder" DROP CONSTRAINT "TourOrder_tourId_fkey";

-- AlterTable
ALTER TABLE "TourOrder" DROP COLUMN "tourId";

-- AddForeignKey
ALTER TABLE "TourOrderItem" ADD CONSTRAINT "TourOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "TourOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TourOrderItem" ADD CONSTRAINT "TourOrderItem_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
