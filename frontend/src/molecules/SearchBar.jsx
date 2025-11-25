import TextInput from "../atoms/TextInput";

export default function SearchBar({ onFocus }) {
  return (
    <div className="rounded-xl bg-white px-4 py-3 shadow-sm flex items-center gap-2">
      <TextInput
        placeholder="Search for a task"
        onFocus={onFocus}
        className="border-none px-0 py-0 focus:ring-0"
      />
      <span className="text-lg text-gray-500">🔍</span>
    </div>
  );
}
