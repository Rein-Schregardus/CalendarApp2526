import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import SmallButton from "./SmallButton";
import { useState } from "react";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


const generateDays = () => {
  const days: Date[] = [];
  const year = 2025;
  const month = 9; // October 0 indexed
  const totalDays = 31;

  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }

  // Overflowing days for month after to fill grid
  const remaining = 35 - totalDays;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
};

const MiniCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const days = generateDays();

  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl p-4 w-full h-full shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <SmallButton>
          <FontAwesomeIcon icon={faChevronLeft} />
        </SmallButton>
        <span className="text-gray-600">October 2025</span>
        <SmallButton>
          <FontAwesomeIcon icon={faChevronRight} />
        </SmallButton>
      </div>

      {/* Content */}
      <div>
        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center font-semibold text-gray-500 mb-1 gap-4">
          {weekdays.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-4 text-center">
          {days.map((date) => 
              <SmallButton
                key={date.toISOString()}
                selected={selectedDate?.toDateString() === date.toDateString()}
                onClick={() => setSelectedDate(date)}
                className="text-sm"
              >
                {date.getDate()}
              </SmallButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
