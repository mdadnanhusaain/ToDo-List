import CheckIcon from "../icons/CheckIcon";
import CrossIcon from "../icons/CrossIcon";

export default function WeeklySummaryCard({ type, count }) {
  const isComplete = type === "complete";
  return (
    <div
      className={`flex gap-3 items-start flex-1 px-4 py-4 ${
        isComplete ? "bg-[#EFF2FF]" : "bg-[#FFE6E7]"
      }`}
    >
      <div className="flex items-center">
        <div
          className={`h-7 w-7 p-[5px] flex items-center justify-center ${
            isComplete ? "bg-[#99ADFF]" : "bg-[#FFB1B5]"
          }`}
        >
          <span
            className={`rounded-[3px] border-2 size-[18px] grid place-items-center ${
              isComplete
                ? "border-[#1C3082] text-[#1C3082]"
                : "border-[#B2282D] text-[#B2282D]"
            }`}
          >
            {isComplete ? (
              <CheckIcon className="w-3 h-3" />
            ) : (
              <CrossIcon className="w-3 h-3" />
            )}
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-normal leading-[28px] text-[#090E23]">
          {isComplete ? "Task Complete" : "Task Pending"}
        </span>
        <div className="flex gap-1 items-end">
          <p className="text-[22px] font-semibold text-[#090E23]">
            {count.toString().padStart(2, "0")}
          </p>
          <p className="text-[10px] text-[#6E7180] mb-1">This Week</p>
        </div>
      </div>
    </div>
  );
}
