"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Save } from "lucide-react";
import { AppButton } from "@/components/shared/app-button";
import { FormPanel } from "@/components/shared/form-panel";
import { StepProduct } from "./step-product";
import { StepAudience } from "./step-audience";
import { StepLiteracy } from "./step-literacy";
import { StepChannels } from "./step-channels";
import { StepBudget } from "./step-budget";
import { WIZARD_STEPS } from "@/features/marketing/config/questions";
import { MarketingAnswersSchema, type MarketingAnswers } from "@/features/marketing/schema";
import { runMarketingAnalysisAction, saveMarketingDraftAction } from "@/features/marketing/actions";
import { cn } from "@/lib/utils";

type Props = {
  companyId: string;
  assessmentId: string;
  initialAnswers?: Record<string, unknown>;
};

export function MarketingWizard({ companyId, assessmentId, initialAnswers }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isAnalyzing, startTransition] = useTransition();

  const form = useForm<MarketingAnswers>({
    resolver: zodResolver(MarketingAnswersSchema),
    defaultValues: {
      productName: (initialAnswers?.productName as string) ?? "",
      productDescription: (initialAnswers?.productDescription as string) ?? "",
      mainFeatures: (initialAnswers?.mainFeatures as string) ?? "",
      industry: (initialAnswers?.industry as MarketingAnswers["industry"]) ?? "saas",
      primaryTargetCustomer: (initialAnswers?.primaryTargetCustomer as string) ?? "",
      marketType: (initialAnswers?.marketType as MarketingAnswers["marketType"]) ?? "b2b",
      ageGroup: (initialAnswers?.ageGroup as MarketingAnswers["ageGroup"]) ?? "age_25_34",
      customerRole:
        (initialAnswers?.customerRole as MarketingAnswers["customerRole"]) ?? "business_owner",
      audienceLocation:
        (initialAnswers?.audienceLocation as MarketingAnswers["audienceLocation"]) ??
        "western_province",
      techComfort: (initialAnswers?.techComfort as MarketingAnswers["techComfort"]) ?? "comfort_3",
      techTermsFamiliarity:
        (initialAnswers?.techTermsFamiliarity as MarketingAnswers["techTermsFamiliarity"]) ??
        "terms_3",
      messageDetailPreference:
        (initialAnswers?.messageDetailPreference as MarketingAnswers["messageDetailPreference"]) ??
        "detail_3",
      keyCustomerBenefit: (initialAnswers?.keyCustomerBenefit as string) ?? "",
      customerPainPoints:
        (initialAnswers?.customerPainPoints as MarketingAnswers["customerPainPoints"]) ?? [
          "saves_time",
          "reduces_costs",
        ],
      channelsCurrentlyUsed:
        (initialAnswers?.channelsCurrentlyUsed as MarketingAnswers["channelsCurrentlyUsed"]) ?? [
          "facebook",
          "website_seo",
        ],
      channelsWorkingBest:
        (initialAnswers?.channelsWorkingBest as MarketingAnswers["channelsWorkingBest"]) ?? [
          "facebook",
        ],
      preferredContent:
        (initialAnswers?.preferredContent as MarketingAnswers["preferredContent"]) ?? [
          "short_videos",
          "images_graphics",
        ],
      monthlyBudgetLkr: (initialAnswers?.monthlyBudgetLkr as number) ?? 50000,
      budgetFlexibility:
        (initialAnswers?.budgetFlexibility as MarketingAnswers["budgetFlexibility"]) ??
        "moderately_flexible",
      campaignDuration:
        (initialAnswers?.campaignDuration as MarketingAnswers["campaignDuration"]) ?? "duration_3m",
      campaignGoals: (initialAnswers?.campaignGoals as MarketingAnswers["campaignGoals"]) ?? [
        "leads",
        "brand_awareness",
      ],
      reservePercentage: (initialAnswers?.reservePercentage as number) ?? 0,
      customAudienceNotes: (initialAnswers?.customAudienceNotes as string) ?? "",
    },
    mode: "onBlur",
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = form;

  const currentStepConfig = WIZARD_STEPS[currentStep - 1];

  const handleNext = async () => {
    // Validate only fields in the current step before advancing
    const stepFields = currentStepConfig.questionIds as (keyof MarketingAnswers)[];
    const isValid = await trigger(stepFields);
    if (!isValid) {
      toast.error("Please answer the required questions in this section before continuing.");
      return;
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const currentValues = getValues();
      const res = await saveMarketingDraftAction(companyId, assessmentId, currentValues);
      if (res?.success) {
        toast.success("Draft saved successfully.");
      } else {
        toast.error("Failed to save draft.");
      }
    } catch {
      toast.error("An error occurred while saving the draft.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const res = await runMarketingAnalysisAction(companyId, assessmentId, values);
      if (res && !res.success) {
        toast.error(res.error || "Analysis failed. Please check inputs.");
      }
    });
  });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      {/* Wizard Step Navigation Bar */}
      <nav
        aria-label="Assessment questionnaire progress"
        className="rounded-xl border border-neutral-200 bg-card p-4 shadow-xs"
      >
        <ol className="grid grid-cols-5 gap-2 sm:gap-4">
          {WIZARD_STEPS.map((s) => {
            const isPassed = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            return (
              <li key={s.step} className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => s.step < currentStep && setCurrentStep(s.step)}
                  disabled={s.step > currentStep || isAnalyzing}
                  className={cn(
                    "group flex items-center gap-2 text-left transition-opacity",
                    s.step > currentStep ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
                      isPassed
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                          ? "bg-neutral-900 text-white ring-2 ring-neutral-900 ring-offset-2"
                          : "bg-neutral-100 text-neutral-600",
                    )}
                  >
                    {isPassed ? <CheckCircle2 className="size-4" /> : s.step}
                  </div>
                  <span className="hidden truncate text-xs font-medium text-neutral-800 md:inline">
                    {s.title}
                  </span>
                </button>
                <div
                  className={cn(
                    "h-1 w-full rounded-full transition-colors",
                    isPassed ? "bg-emerald-600" : isCurrent ? "bg-neutral-900" : "bg-neutral-150",
                  )}
                />
              </li>
            );
          })}
        </ol>
      </nav>

      <FormPanel title={currentStepConfig.title} description={currentStepConfig.description}>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          {currentStep === 1 && (
            <StepProduct register={register} control={control} errors={errors} />
          )}
          {currentStep === 2 && (
            <StepAudience register={register} control={control} errors={errors} />
          )}
          {currentStep === 3 && <StepLiteracy control={control} errors={errors} />}
          {currentStep === 4 && (
            <StepChannels register={register} control={control} errors={errors} />
          )}
          {currentStep === 5 && (
            <StepBudget register={register} control={control} errors={errors} />
          )}

          {/* Action Navigation Buttons */}
          <div className="flex flex-col-reverse items-center justify-between gap-3 border-t border-neutral-200 pt-6 sm:flex-row">
            <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
              <AppButton
                type="button"
                variant="secondary"
                onClick={handlePrev}
                disabled={currentStep === 1 || isAnalyzing}
                className="gap-2"
              >
                <ArrowLeft className="size-4" />
                Previous
              </AppButton>
              <AppButton
                type="button"
                variant="ghost"
                onClick={handleSaveDraft}
                disabled={isSavingDraft || isAnalyzing}
                className="gap-2 text-neutral-600 hover:text-neutral-900"
              >
                {isSavingDraft ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save Draft
              </AppButton>
            </div>

            <div className="flex w-full justify-end sm:w-auto">
              {currentStep < 5 ? (
                <AppButton
                  type="button"
                  onClick={handleNext}
                  disabled={isAnalyzing}
                  className="w-full gap-2 sm:w-auto"
                >
                  Continue to Next Step
                  <ArrowRight className="size-4" />
                </AppButton>
              ) : (
                <AppButton
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Computing AHP & Strategy...
                    </>
                  ) : (
                    <>
                      Run Marketing Strategy Analysis
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </AppButton>
              )}
            </div>
          </div>
        </form>
      </FormPanel>
    </div>
  );
}
