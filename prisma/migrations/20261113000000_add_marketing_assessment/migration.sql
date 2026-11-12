-- CreateTable
CREATE TABLE "MarketingAssessment" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "answers" JSONB NOT NULL DEFAULT '{}',
    "report" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarketingAssessment_companyId_idx" ON "MarketingAssessment"("companyId");

-- AddForeignKey
ALTER TABLE "MarketingAssessment" ADD CONSTRAINT "MarketingAssessment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

