"use client";

import Link from "next/link";
import { ArrowLeft, Download, Printer, RefreshCw } from "lucide-react";
import { AppButton } from "@/components/shared/app-button";
import { AudienceCard } from "./audience-card";
import { MessagesCard } from "./messages-card";
import { AHPCard } from "./ahp-card";
import { BudgetCard } from "./budget-card";
import { ActionsCard } from "./actions-card";
import { CitationsCard } from "./citations-card";
import { ResearchEvalCard } from "./research-eval-card";
import type { MarketingAnswers, MarketingReport as ReportType } from "@/features/marketing/schema";

type Props = {
  companyId: string;
  assessmentId: string;
  report: ReportType;
  answers: MarketingAnswers;
};

export function MarketingReport({ companyId, assessmentId, report, answers }: Props) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const payload = {
      assessmentId,
      companyId,
      answers,
      report,
      exportTimestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marketing_strategy_report_${answers.productName?.toLowerCase().replace(/\s+/g, "_") || "assessment"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 pb-16">
      {/* Executive Report Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AppButton variant="ghost" asChild className="-ml-2 gap-1.5 text-xs">
              <Link href={`/companies/${companyId}/marketing`}>
                <ArrowLeft className="size-4" />
                Back to Marketing
              </Link>
            </AppButton>
            <span className="text-neutral-300">|</span>
            <span className="font-mono text-xs text-neutral-500">
              ID: {assessmentId.slice(0, 8)}...
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Marketing Strategy Assessment: {answers.productName || "Product Report"}
          </h1>
          <p className="text-xs text-neutral-500">
            Generated on{" "}
            {new Date(report.generatedAt).toLocaleDateString("en-LK", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            • Methodology {report.methodologyVersion}
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <AppButton variant="secondary" onClick={handleDownloadJSON} className="gap-1.5 text-xs">
            <Download className="size-3.5" />
            Export Data
          </AppButton>
          <AppButton variant="secondary" onClick={handlePrint} className="gap-1.5 text-xs">
            <Printer className="size-3.5" />
            Print Report
          </AppButton>
          <AppButton asChild className="gap-1.5 text-xs">
            <Link href={`/companies/${companyId}/marketing/${assessmentId}`}>
              <RefreshCw className="size-3.5" />
              Edit / Rerun
            </Link>
          </AppButton>
        </div>
      </div>

      {/* Main Sections */}
      <AudienceCard data={report.audienceIntelligence} />
      <MessagesCard data={report.featureToValue} />
      <AHPCard data={report.channelStrategy} />
      <BudgetCard data={report.budgetPlan} />
      <ActionsCard actions={report.actionPlan} />
      <CitationsCard citations={report.citations} />
      <ResearchEvalCard />
    </div>
  );
}
