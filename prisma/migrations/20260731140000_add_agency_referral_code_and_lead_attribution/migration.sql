-- AlterTable
ALTER TABLE "Agency" ADD COLUMN     "referralCode" TEXT,
ADD COLUMN     "logoUrl" TEXT;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "agencyId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Agency_referralCode_key" ON "Agency"("referralCode");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;
