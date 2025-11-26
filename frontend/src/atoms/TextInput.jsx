export default function TextInput({ className = "", ...props }) {
  return (
    <input
      className={
        "w-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 " +
        className
      }
      {...props}
    />
  );
}
