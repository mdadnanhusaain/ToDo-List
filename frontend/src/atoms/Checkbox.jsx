export default function Checkbox({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={
        "flex h-5 w-5 items-center justify-center rounded border " +
        (checked
          ? "border-indigo-500 bg-indigo-500 text-white"
          : "border-gray-300 bg-white")
      }
    >
      {checked && (
        <span className="text-[11px] leading-none select-none">✓</span>
      )}
    </button>
  );
}
