import { useEffect, useState } from "react";
import {
  getTasksByDate,
  getWeeklySummary,
  toggleTaskStatus,
  deleteTask,
} from "../api/tasks";
import SearchBar from "../molecules/SearchBar";
import WeeklySummaryCard from "../molecules/WeeklySummaryCard";
import TaskListItem from "../molecules/TaskListItem";
import OnboardingSheet from "../organisms/OnboardingSheet";
import AddTaskSheet from "../organisms/AddTaskSheet";
import SearchSheet from "../organisms/SearchSheet";

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [editingTask, setEditingTask] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({ completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadTasksForDate = async (date) => {
    setLoading(true);
    try {
      const dateStr = date.toISOString().split("T")[0];
      const tasksData = await getTasksByDate(date);
      setTasks(tasksData);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async (date) => {
    try {
      const weekly = await getWeeklySummary(date || selectedDate);
      setSummary(weekly);
    } catch (error) {
      console.error("Failed to load summary:", error);
    }
  };

  const loadData = async () => {
    await Promise.all([loadTasksForDate(selectedDate), loadSummary()]);
  };

  useEffect(() => {
    const seen = localStorage.getItem("todo_onboarding_seen");
    if (!seen) setShowOnboarding(true);
    loadSummary();
    loadTasksForDate(selectedDate);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadTasksForDate(selectedDate);
      loadSummary(selectedDate);
    }
  }, [selectedDate]);

  const tasksToShow = showAllTasks ? tasks : tasks.slice(0, 4);

  const handleToggleTask = async (taskId) => {
    setActionLoading(true);
    try {
      await toggleTaskStatus(taskId);
      await loadData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setActionLoading(true);
    try {
      await deleteTask(taskId);
      await loadData();
    } finally {
      setActionLoading(false);
    }
  };

  const getCurrentWeekDates = () => {
    const dates = [];
    const today = new Date();
    const currentDay = today.getDay();
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;

    const monday = new Date(today);
    monday.setDate(today.getDate() - daysFromMonday);
    monday.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const currentWeekDates = getCurrentWeekDates();
  const totalTasks = summary.completed + summary.pending;
  const progressPercentage =
    totalTasks > 0 ? (summary.completed / totalTasks) * 100 : 0;

  const formatDay = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  const isSelectedDate = (date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const LoadingSpinner = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="app-shell flex flex-col min-h-screen">
      <div className="px-6 py-9">
        <div className="mb-5">
          <SearchBar onFocus={() => setShowSearch(true)} />
        </div>

        <div className="mb-5 -mx-1.5">
          <div className="flex gap-[10px] justify-between">
            {currentWeekDates.map((date, dayIdx) => (
              <button
                key={`${date.getTime()}-${dayIdx}`}
                onClick={() => setSelectedDate(new Date(date))}
                className={`flex flex-col items-center justify-between shrink-0 transition-all cursor-pointer px-2 ${
                  isSelectedDate(date)
                    ? "bg-[#4566EC] text-white w-[39px] h-[63px] py-1.5"
                    : "bg-white text-[#C0C0C0] w-[35px] h-[51px] py-1"
                }`}
              >
                <span className="text-[10px] font-normal leading-[22px]">
                  {formatDay(date)}
                </span>
                <span className="text-[14px] font-medium leading-[22px]">
                  {date.getDate()}
                </span>
                {isSelectedDate(date) && (
                  <span className="w-1 h-1 bg-white rounded-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <WeeklySummaryCard type="complete" count={summary.completed} />
          <WeeklySummaryCard type="pending" count={summary.pending} />
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3.5">Weekly Progress</h2>
          <div className="h-6 bg-[#DADAFF] overflow-hidden">
            <div
              className="h-full bg-[#253C98] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-[#090E23]">
              Tasks Today
            </h2>
            {tasks.length > 4 && (
              <button
                className="text-sm font-medium text-[#4566EC] cursor-pointer"
                onClick={() => setShowAllTasks((v) => !v)}
              >
                {showAllTasks ? "Show Less" : "View All"}
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl divide-y divide-gray-100 overflow-hidden">
            {tasksToShow.length > 0 ? (
              tasksToShow.map((t) => (
                <TaskListItem
                  key={t._id}
                  task={{
                    id: t._id,
                    title: t.title,
                    completed: t.status === "completed",
                  }}
                  onToggle={() => handleToggleTask(t._id)}
                  onDelete={() => handleDeleteTask(t._id)}
                  onEdit={() => {
                    setEditingTask(t);
                    setShowAddTask(true);
                  }}
                />
              ))
            ) : (
              <div className="py-8 text-center text-sm text-gray-400">
                No tasks for this date
              </div>
            )}
          </div>
        </div>
      </div>

      {actionLoading && <LoadingSpinner />}

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <button
          className="h-14 w-14 rounded-full bg-indigo-600 text-white text-3xl font-light leading-none shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
          onClick={() => setShowAddTask(true)}
          disabled={loading || actionLoading}
        >
          +
        </button>
      </div>

      <OnboardingSheet
        isOpen={showOnboarding}
        onClose={() => {
          localStorage.setItem("todo_onboarding_seen", "1");
          setShowOnboarding(false);
        }}
      />
      <AddTaskSheet
        isOpen={showAddTask}
        onClose={() => {
          setShowAddTask(false);
          setEditingTask(null);
        }}
        onCreated={loadData}
        task={editingTask}
      />
      <SearchSheet
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onTaskUpdated={loadData}
      />
    </div>
  );
}
