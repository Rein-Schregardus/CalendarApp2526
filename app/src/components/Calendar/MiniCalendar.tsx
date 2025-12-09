import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import SmallButton from "@/components/SmallButton";
import { useState } from "react";

import { generateDays } from "@/utils/dateUtils";

interface MiniCalendarProps {
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  date: Date;
}

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MiniCalendar = ({ setDate, date }: MiniCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(date.getMonth());
  const [currentYear, setCurrentYear] = useState(date.getFullYear());

  const days = generateDays(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-primary rounded-xl p-4 w-full h-full shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <SmallButton onClick={handlePrevMonth}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </SmallButton>
        <span className="text-gray-600 font-medium">
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <SmallButton onClick={handleNextMonth}>
          <FontAwesomeIcon icon={faChevronRight} />
        </SmallButton>
      </div>

      {/* Content */}
      <div>
        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center font-semibold text-gray-500 mb-2 gap-4">
          {weekdays.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {days.map((d) => {
            const isSelected =
              d.toDateString() === date.toDateString();

            return (
              <SmallButton
                key={d.toISOString()}
                selected={isSelected}
                onClick={() => setDate(d)} // 👈 update parent state
                className={`text-sm ${
                  isSelected ? "bg-accent text-white" : ""
                }`}
              >
                {d.getDate()}
              </SmallButton>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
