import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const dummyDays = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4,
];

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MiniCalendar = () => {
  return (
    <div className="flex flex-col gap-8 bg-white rounded-xl p-4 sm:p-8 w-full h-full shadow-[4px_4px_9px_4px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-[#e0e2e6]">
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        <span className="text-[#666666]">October 2025</span>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-[#e0e2e6]">
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>

      {/* Content */}
      <div>
        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center font-semibold text-[#666666] mb-1 gap-4">
          {weekdays.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-4 text-center">
          {dummyDays.map((day, i) => (
            <div
              key={i}
              className={`h-10 w-10 flex items-center justify-center rounded-full cursor-pointer 
                ${
                  day === 12
                    ? "bg-[#0576ff] text-white hover:bg-[#035fd0]"
                    : "hover:bg-[#e0e2e6]"
                }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
