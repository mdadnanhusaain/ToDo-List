export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={
        "rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60 " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
