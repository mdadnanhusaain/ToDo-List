import { useState, useRef, useEffect } from "react";
import ClockIcon from "../icons/ClockIcon";

export default function TimePicker({ value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(
    value ? value.split(":")[0] || "00" : "00"
  );
  const [minutes, setMinutes] = useState(
    value ? value.split(":")[1] || "00" : "00"
  );
  const containerRef = useRef(null);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      setHours(h || "00");
      setMinutes(m || "00");
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleTimeSelect = (h, m) => {
    setHours(h);
    setMinutes(m);
    onChange(`${h}:${m}`);
    setIsOpen(false);
  };

  const formatTime = (h, m) => {
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  const displayValue = value
    ? formatTime(hours, minutes)
    : placeholder || "--:--";

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-left flex items-center gap-2"
      >
        <ClockIcon className="w-4 h-4 text-gray-400" />
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {displayValue}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-full">
          <div className="flex max-h-[200px] overflow-hidden">
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {Array.from({ length: 24 }, (_, i) => {
                const h = i.toString().padStart(2, "0");
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleTimeSelect(h, minutes)}
                    className={`w-full px-4 py-2 text-sm hover:bg-indigo-50 transition-colors ${
                      hours === h
                        ? "bg-indigo-100 text-indigo-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {h}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide border-l border-gray-200">
              {Array.from({ length: 60 }, (_, i) => {
                const m = i.toString().padStart(2, "0");
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleTimeSelect(hours, m)}
                    className={`w-full px-4 py-2 text-sm hover:bg-indigo-50 transition-colors ${
                      minutes === m
                        ? "bg-indigo-100 text-indigo-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
