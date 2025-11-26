export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={
        "bg-[#4566EC] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60 hover:bg-[#4566EC] transition-colors " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
