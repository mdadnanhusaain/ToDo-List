import { useState } from "react";
import BottomSheet from "../atoms/BottomSheet";
import TextInput from "../atoms/TextInput";
import Button from "../atoms/Button";
import { createTask } from "../api/tasks";

export default function AddTaskSheet({ isOpen, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [submitting, setSubmitting] = useState(false);

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
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

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTask({
        title,
        description,
        date,
        startTime,
        endTime,
        priority,
      });
      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setPriority("medium");
      setDate(new Date().toISOString().slice(0, 10));
      if (onCreated) await onCreated();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-5 text-base font-semibold">Add New Task</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-xs font-medium text-gray-500">
            Task title
          </label>
          <TextInput
            placeholder="Doing Homework"
            className="mt-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500">Set Time</label>
          <div className="mt-1 flex gap-2">
            <div className="flex-1 relative">
              <TextInput
                type="time"
                className="pr-10"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="Start"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                🕐
              </span>
            </div>
            <div className="flex-1 relative">
              <TextInput
                type="time"
                className="pr-10"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="Ends"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                🕐
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500">Set Date</label>
          <div className="mt-1 relative">
            <TextInput
              type="date"
              className="pr-10"
              value={date}
              onChange={handleDateChange}
              required
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
              📅
            </span>
            {date && (
              <div className="mt-2 text-xs text-gray-600">
                {formatDateDisplay(date)}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500">Priority</label>
          <select
            className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500">
            Description
          </label>
          <textarea
            className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
            rows={3}
            placeholder="Add Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="mt-4 w-full justify-center"
          disabled={submitting || !title || !date}
        >
          {submitting ? "Creating..." : "Create task"}
        </Button>
      </form>
    </BottomSheet>
  );
}
