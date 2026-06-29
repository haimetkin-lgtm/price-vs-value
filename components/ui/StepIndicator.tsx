"use client";

interface Step { label: string; }

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        return (
          <div key={i} className="flex items-center flex-1">
            <button
              onClick={() => isCompleted && onStepClick?.(i)}
              disabled={!isCompleted}
              className="flex flex-col items-center gap-1 flex-shrink-0"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                ${isCompleted ? "bg-blue-600 text-white cursor-pointer" : ""}
                ${isCurrent ? "bg-blue-600 text-white ring-4 ring-blue-100" : ""}
                ${!isCompleted && !isCurrent ? "bg-gray-100 text-gray-400" : ""}`}>
                {isCompleted ? "✓" : i + 1}
              </div>
              <span className={`text-xs hidden sm:block whitespace-nowrap
                ${isCurrent ? "text-blue-600 font-medium" : "text-gray-400"}`}>
                {step.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 ${isCompleted ? "bg-blue-600" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
