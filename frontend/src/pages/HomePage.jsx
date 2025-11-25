import { useEffect, useState } from "react";
import {
  getTodayTasks,
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
import Button from "../atoms/Button";

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({ completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [todayTasks, weekly] = await Promise.all([
        getTodayTasks(),
        getWeeklySummary(),
      ]);
      setTasks(todayTasks);
      setSummary(weekly);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const seen = localStorage.getItem("todo_onboarding_seen");
    if (!seen) setShowOnboarding(true);
    loadData();
  }, []);

  const tasksToShow = showAllTasks ? tasks : tasks.slice(0, 4);

  const handleToggleTask = async (taskId) => {
    await toggleTaskStatus(taskId);
    loadData();
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    loadData();
  };

  // Generate week dates (Sunday to Sunday)
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);

    for (let i = 0; i < 8; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const totalTasks = summary.completed + summary.pending;
  const progressPercentage =
    totalTasks > 0 ? (summary.completed / totalTasks) * 100 : 0;

  const formatDay = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  const isSelectedDate = (date) => {
    const today = new Date();
    // If no date is explicitly selected, highlight today
    const compareDate = selectedDate || today;
    return (
      date.getDate() === compareDate.getDate() &&
      date.getMonth() === compareDate.getMonth() &&
      date.getFullYear() === compareDate.getFullYear()
    );
  };

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center min-h-screen">
        Loading…
      </div>
    );
  }

  return (
    <div className="app-shell flex min-h-screen flex-col bg-gray-100 pb-20">
      <div className="px-4 pt-6">
        {/* Home Title */}
        <h1 className="text-sm font-medium text-gray-400 mb-4">Home</h1>

        {/* Search Bar */}
        <div className="mb-5">
          <SearchBar onFocus={() => setShowSearch(true)} />
        </div>

        {/* Date Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {weekDates.map((date, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDate(date)}
              className={`shrink-0 flex flex-col items-center justify-center px-3 py-2 rounded-lg min-w-[50px] transition-colors ${
                isSelectedDate(date)
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              <span className="text-xs font-medium">{formatDay(date)}</span>
              <span className="text-sm font-semibold mt-1">
                {date.getDate()}
              </span>
              {isSelectedDate(date) && (
                <span className="w-1 h-1 bg-white rounded-full mt-1"></span>
              )}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="flex gap-3 mb-4">
          <WeeklySummaryCard type="complete" count={summary.completed} />
          <WeeklySummaryCard type="pending" count={summary.pending} />
        </div>

        {/* Weekly Progress */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-2">Weekly Progress</h2>
          <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Tasks Today */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">Tasks Today</h2>
            {tasks.length > 4 && (
              <button
                className="text-xs font-medium text-indigo-600"
                onClick={() => setShowAllTasks((v) => !v)}
              >
                {showAllTasks ? "Show Less" : "View All"}
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-100 bg-white rounded-xl overflow-hidden">
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
                    // TODO: Implement edit functionality
                    console.log("Edit task", t._id);
                  }}
                />
              ))
            ) : (
              <div className="py-8 text-center text-sm text-gray-400">
                No tasks for today
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed FAB */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <Button
          className="h-14 w-14 rounded-full p-0 text-3xl leading-none shadow-lg"
          onClick={() => setShowAddTask(true)}
        >
          +
        </Button>
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
        onClose={() => setShowAddTask(false)}
        onCreated={loadData}
      />
      <SearchSheet
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onTaskUpdated={loadData}
      />
    </div>
  );
}
