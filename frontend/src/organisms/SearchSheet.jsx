import { useEffect, useState } from "react";
import BottomSheet from "../atoms/BottomSheet";
import TextInput from "../atoms/TextInput";
import TaskListItem from "../molecules/TaskListItem";
import AddTaskSheet from "./AddTaskSheet";
import SearchIcon from "../icons/SearchIcon";
import BackIcon from "../icons/BackIcon";
import {
  searchTasks,
  toggleTaskStatus,
  deleteTask,
  getAllTasks,
} from "../api/tasks";

export default function SearchSheet({ isOpen, onClose, onTaskUpdated }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      return;
    }

    const loadTopTasks = async () => {
      setLoading(true);
      try {
        const allTasks = await getAllTasks();

        const topTasks = allTasks.slice(0, 4);
        setResults(topTasks);
      } catch (error) {
        console.error("Failed to load top tasks:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (!query.trim()) {
      loadTopTasks();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);

    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        try {
          const allTasks = await getAllTasks();
          const topTasks = allTasks.slice(0, 4);
          setResults(topTasks);
        } catch (error) {
          console.error("Failed to load top tasks:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        const res = await searchTasks(query.trim());
        setResults(res);
      } catch (error) {
        console.error("Failed to search tasks:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [query, isOpen]);

  const refreshResults = async () => {
    if (query.trim()) {
      const res = await searchTasks(query.trim());
      setResults(res);
    } else {
      const allTasks = await getAllTasks();
      const topTasks = allTasks.slice(0, 4);
      setResults(topTasks);
    }
  };

  const handleToggle = async (id) => {
    setActionLoading(true);
    try {
      await toggleTaskStatus(id);
      await refreshResults();
      if (onTaskUpdated) onTaskUpdated();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await deleteTask(id);
      await refreshResults();
      if (onTaskUpdated) onTaskUpdated();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} full={true}>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Back"
          >
            <BackIcon className="h-6 w-6 cursor-pointer" />
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <TextInput
              placeholder="Finish"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-gray-400">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="bg-white rounded-xl divide-y divide-gray-100">
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
                  onEdit={() => {
                    setEditingTask(t);
                    setShowEditTask(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-gray-400 py-8">
              No tasks available
            </div>
          )}
          {actionLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600">Processing...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <AddTaskSheet
        isOpen={showEditTask}
        onClose={() => {
          setShowEditTask(false);
          setEditingTask(null);
        }}
        onCreated={async () => {
          await refreshResults();
          if (onTaskUpdated) onTaskUpdated();
        }}
        task={editingTask}
      />
    </BottomSheet>
  );
}
