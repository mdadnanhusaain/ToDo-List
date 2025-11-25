export default function WeeklySummaryCard({ type, count }) {
  const isComplete = type === "complete";
  return (
    <div
      className={
        "flex-1 rounded-xl px-3 py-3 " +
        (isComplete ? "bg-indigo-50" : "bg-rose-50")
      }
    >
      <div className="flex items-center gap-2 text-xs">
        <span
          className={
            "inline-flex h-5 w-5 items-center justify-center rounded border text-[11px]" +
            (isComplete
              ? " border-indigo-500 text-indigo-500"
              : " border-rose-400 text-rose-400")
          }
        >
          {isComplete ? "✔" : "✕"}
        </span>
        <span className="font-medium">
          Task {isComplete ? "Complete" : "Pending"}
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold">
        {count.toString().padStart(2, "0")}
      </p>
      <p className="text-[11px] text-gray-500">This Week</p>
    </div>
  );
}
