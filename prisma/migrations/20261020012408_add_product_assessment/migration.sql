-- CreateTable
CREATE TABLE "ProductAssessment" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "answers" JSONB NOT NULL DEFAULT '{}',
    "report" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductAssessment_companyId_idx" ON "ProductAssessment"("companyId");

-- AddForeignKey
ALTER TABLE "ProductAssessment" ADD CONSTRAINT "ProductAssessment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
