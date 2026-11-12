import { Calendar, CheckSquare, Target } from "lucide-react";
import type { ActionItem } from "@/features/marketing/schema";

type Props = {
  actions: ActionItem[];
};

export function ActionsCard({ actions }: Props) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-card p-6 shadow-xs">
      <div className="border-b border-neutral-200 pb-4">
        <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          Strategic Execution Plan
        </span>
        <h3 className="mt-0.5 text-lg font-bold text-neutral-900">
          Phased Campaign Implementation Roadmap
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {actions.map((act, idx) => (
          <div
            key={idx}
            className="relative flex flex-col gap-3 rounded-lg border border-neutral-200 bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900">{act.phase}</span>
              <span className="flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                <Calendar className="size-3 text-neutral-500" />
                {act.timeframe}
              </span>
            </div>

            <p className="text-xs leading-relaxed font-medium text-neutral-800">{act.actionItem}</p>

            <div className="border-neutral-150 mt-auto flex flex-col gap-1 border-t pt-3 text-[11px]">
              <div className="flex items-center gap-1.5 text-neutral-600">
                <Target className="size-3 shrink-0 text-neutral-500" />
                <span className="truncate">
                  Channel: <strong className="text-neutral-900">{act.channel}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-600">
                <CheckSquare className="size-3 shrink-0 text-neutral-500" />
                <span className="truncate">
                  Target: <strong className="text-neutral-900 capitalize">{act.goal}</strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
