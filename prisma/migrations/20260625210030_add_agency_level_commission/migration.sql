-- CreateEnum
CREATE TYPE "AgencyLevel" AS ENUM ('bronze', 'silver', 'gold', 'platinum');

-- AlterTable
ALTER TABLE "Agency" ADD COLUMN     "commissionPct" DOUBLE PRECISION NOT NULL DEFAULT 18,
ADD COLUMN     "level" "AgencyLevel" NOT NULL DEFAULT 'bronze',
ADD COLUMN     "taxId" TEXT,
ADD COLUMN     "websiteUrl" TEXT;
