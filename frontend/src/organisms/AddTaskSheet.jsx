import { useState, useEffect } from "react";
import BottomSheet from "../atoms/BottomSheet";
import TextInput from "../atoms/TextInput";
import Button from "../atoms/Button";
import CrossIcon from "../icons/CrossIcon";
import TimePicker from "../atoms/TimePicker";
import DatePicker from "../atoms/DatePicker";
import Select from "../atoms/Select";
import { createTask, updateTask } from "../api/tasks";

export default function AddTaskSheet({ isOpen, onClose, onCreated, task }) {
  const [title, setTitle] = useState("");

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [date, setDate] = useState(getTodayDateString());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [submitting, setSubmitting] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (task && isOpen) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "medium");
      setStartTime(task.startTime || "");
      setEndTime(task.endTime || "");

      if (task.date) {
        // Parse date correctly to avoid timezone issues

        const taskDate = new Date(task.date);
        // Use local methods to get the date components
        const year = taskDate.getFullYear();
        const month = String(taskDate.getMonth() + 1).padStart(2, "0");
        const day = String(taskDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        setDate(dateStr);
      }
    } else if (!task && isOpen) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStartTime("");
      setEndTime("");

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      setDate(`${year}-${month}-${day}`);
    }
  }, [task, isOpen]);

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "";
    // Parse YYYY-MM-DD format as local date
    let date;
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split("-").map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateString);
    }
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${days[date.getDay()]} ${date.getDate()}, ${
      months[date.getMonth()]
    }`;
  };

  useEffect(() => {
    if (date) {
      setFormattedDate(formatDateDisplay(date));
    }
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const taskData = {
        title,
        description,
        date,
        startTime,
        endTime,
        priority,
      };

      if (task) {
        await updateTask(task._id, taskData);
      } else {
        await createTask(taskData);
      }

      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setPriority("medium");

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      setDate(`${year}-${month}-${day}`);

      if (onCreated) await onCreated();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {task ? "Edit Task" : "Add New Task"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <CrossIcon className="w-5 h-5 text-[#090E23]" />
        </button>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">
            Task title
          </label>
          <TextInput
            placeholder="Add Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">
            Set Time
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <TimePicker
                value={startTime}
                onChange={setStartTime}
                placeholder="Start"
              />
            </div>
            <div className="flex-1">
              <TimePicker
                value={endTime}
                onChange={setEndTime}
                placeholder="Ends"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">
            Set Date
          </label>
          <DatePicker
            value={date}
            onChange={(dateStr) => {
              setDate(dateStr);
            }}
            onFormattedDateChange={setFormattedDate}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">
            Priority
          </label>
          <Select
            value={priority}
            onChange={setPriority}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">
            Description
          </label>
          <textarea
            className="w-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            rows={3}
            placeholder="Add Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full justify-center bg-[#4566EC] font-medium! text-base"
          disabled={submitting || !title || !date}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></span>
              {task ? "Updating..." : "Creating..."}
            </span>
          ) : task ? (
            "Update task"
          ) : (
            "Create task"
          )}
        </Button>
      </form>
    </BottomSheet>
  );
}
