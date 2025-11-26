import TextInput from "../atoms/TextInput";
import SearchIcon from "../icons/SearchIcon";

export default function SearchBar({ onFocus }) {
  return (
    <div className="relative">
      <TextInput
        placeholder="Search for a task"
        onFocus={onFocus}
        className="px-5 py-4 rounded-sm! font-light text-xs"
        id="search-bar"
      />
      <label htmlFor="search-bar">
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-400" />
        </div>
      </label>
    </div>
  );
}
