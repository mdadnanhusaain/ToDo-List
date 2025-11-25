export default function TextInput({ className = "", ...props }) {
  return (
    <input
      className={
        "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 " +
        className
      }
      {...props}
    />
  );
}
