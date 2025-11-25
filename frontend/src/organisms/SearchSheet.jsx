import { useEffect, useState } from "react";
import BottomSheet from "../atoms/BottomSheet";
import TextInput from "../atoms/TextInput";
import TaskListItem from "../molecules/TaskListItem";
import { searchTasks, toggleTaskStatus, deleteTask } from "../api/tasks";

export default function SearchSheet({ isOpen, onClose, onTaskUpdated }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await searchTasks(query.trim());
        setResults(res);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleToggle = async (id) => {
    await toggleTaskStatus(id);
    if (query.trim()) {
      const res = await searchTasks(query.trim());
      setResults(res);
    }
    if (onTaskUpdated) onTaskUpdated();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    if (query.trim()) {
      const res = await searchTasks(query.trim());
      setResults(res);
    }
    if (onTaskUpdated) onTaskUpdated();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} full>
      <div className="flex flex-col h-full">
        {/* Header with back arrow */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-base font-semibold">Search Tasks</h2>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <TextInput
              placeholder="Finish"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center text-sm text-gray-400 py-8">
              Searching...
            </div>
          ) : query.trim() && results.length === 0 ? (
            <div className="text-center text-sm text-gray-400 py-8">
              No tasks found
            </div>
          ) : (
            <div className="space-y-1 bg-white rounded-xl divide-y divide-gray-100">
              {results.map((t) => (
                <TaskListItem
                  key={t._id}
                  task={{
                    id: t._id,
                    title: t.title,
                    completed: t.status === "completed",
                  }}
                  onToggle={() => handleToggle(t._id)}
                  onDelete={() => handleDelete(t._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
