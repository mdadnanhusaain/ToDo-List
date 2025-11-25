export default function BottomSheet({
  isOpen,
  onClose,
  children,
  full = false, // full-screen (onboarding) vs partial height (add/search)
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/30">
      <div
        className={
          "app-shell pointer-events-auto relative w-full rounded-t-3xl bg-white shadow-xl transition-transform " +
          (full ? "h-full rounded-b-none" : "max-h-[80%]")
        }
      >
        {!full && (
          <div className="flex justify-center py-2">
            <div className="h-1 w-10 rounded-full bg-gray-300" />
          </div>
        )}
        {!full && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
        <div className="h-full overflow-y-auto px-5 pb-6 pt-10">{children}</div>
      </div>
    </div>
  );
}
