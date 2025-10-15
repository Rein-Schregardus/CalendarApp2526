import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

import DropdownButton from "./Dropdown/DropdownButton";
import DropdownItem from "./Dropdown/DropdownItem";
import SmallButton from "./SmallButton";
import { useState, useRef } from "react";

const Schedule = () => {
  const weekdays: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const gridHeight = 80;

  const hours: string[] = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

  const [viewType, setViewType] = useState("Week");
  const [gridZoom, setGridZoom] = useState(100);

  const appointments = [
    { id: 1, title: "Team Meeting", color: "#f94449", dayIndex: 2, start: "07:00", end: "10:30" },
    { id: 1, title: "Presentation", color: "#72bf6a", dayIndex: 4, start: "09:00", end: "11:40" },
  ];

  // const containerRef = useRef<HTMLDivElement>(null);

  const timeToPixels = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return (h + m / 60) * gridHeight / 100 * gridZoom;
  };

  const increaseGridZoom = () => {
    if (gridZoom < 150) {
      setGridZoom(gridZoom + 10)
    }
  }

  const decreaseGridZoom = () => {
    if (gridZoom > 50) {
      setGridZoom(gridZoom - 10)
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-md h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-8">
          <button className="flex items-center border border-gray-500 rounded-full h-10 px-8 cursor-pointer hover:bg-secondary transition">
            <span className="text-base">Today</span>
          </button>

          <div className="flex items-center justify-center gap-1">
            <SmallButton>
              <FontAwesomeIcon icon={faChevronLeft} />
            </SmallButton>
            <SmallButton>
              <FontAwesomeIcon icon={faChevronRight} />
            </SmallButton>
          </div>

          <h2 className="text-lg font-semibold">October 2025</h2>
        </div>

        {/* Right section */}
        <div className="flex gap-4">
          {/* Zoom buttons */}
          <div className="flex gap-2 items-center">
            <button 
              type="button" 
              onClick={() => decreaseGridZoom()} 
              className="flex items-center justify-center p-2 rounded-sm border-1 border-gray-300 cursor-pointer"
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <span className="flex items-center justify-center">{gridZoom}%</span>
            <button 
              type="button"
              onClick={() => increaseGridZoom()} 
              className="flex items-center justify-center p-2 rounded-sm border-1 border-gray-300 cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          {/* View Dropdown */}
          <DropdownButton
            label={viewType}
            className="flex items-center justify-between gap-2 border border-gray-500 rounded-full min-w-20 h-10 px-4 cursor-pointer hover:bg-secondary transition"
          >
            <DropdownItem onClick={() => setViewType("Day")}>Day</DropdownItem>
            <DropdownItem onClick={() => setViewType("Week")}>Week</DropdownItem>
            <DropdownItem onClick={() => setViewType("Month")}>Month</DropdownItem>
          </DropdownButton>
        </div>
      </div>

      <hr className="my-4 text-gray-300" />

      {/* Dates & Days */}
      <div className="flex w-full ">
        <div
          className="grid pl-16 w-full border-gray-300"
          style={{
            gridTemplateColumns: `repeat(${weekdays.length}, 1fr)`,
            gridTemplateRows: "64px",
          }}
        >
          {weekdays.map((weekday, i) => (
            <div key={weekday} className="flex flex-col items-center justify-center">
              <span>{weekday}</span>
              <span>{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule content */}
      <div className="flex w-full flex-1 overflow-hidden">
        {/* Scrollable container */}
        <div
          // ref={containerRef}
          className="flex relative flex-1 py-4 overflow-y-auto overflow-x-hidden scrollbar-hide"
        >
          {/* Hours column */}
          <div
            className="grid w-16"
            style={{
              gridTemplateColumns: "20px",
              gridTemplateRows: `repeat(${hours.length}, ${gridHeight / 100 * gridZoom}px)`,
            }}
          >
            {hours.map((hour) => (
              <div key={hour} className="relative">
                <span className="absolute -top-3">{hour}</span>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="relative flex-1">
            <div
              className="grid w-full border-gray-300" // 🔧 CHANGED min-w-full → w-full
              style={{
                gridTemplateColumns: `repeat(${weekdays.length}, 1fr)`, // 🔧 CHANGED minmax(150px, 1fr) → 1fr
                gridTemplateRows: `repeat(${hours.length}, ${gridHeight / 100 * gridZoom}px)`,
              }}
            >
              {hours.map((hour, rowIndex) =>
                weekdays.map((day) => (
                  <div
                    key={`${day}-${hour}`}
                    className="border-b border-r border-gray-200 text-gray-500"
                  ></div>
                ))
              )}
            </div>

            {/* Appointment layer */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {appointments.map((appt) => {
                const top = timeToPixels(appt.start);
                const height = timeToPixels(appt.end) - top;
                const columnWidth = 100 / weekdays.length;
                const left = `${appt.dayIndex * columnWidth}%`;

                return (
                  <div
                    key={appt.id}
                    className="absolute flex flex-col text-white text-sm rounded-lg p-2 shadow-md pointer-events-auto cursor-pointer"
                    style={{
                      backgroundColor: `${appt.color}`,
                      top,
                      height,
                      left,
                      width: `calc(${columnWidth}% - 8px)`,
                      marginLeft: "4px",
                    }}
                  >
                    <span className="font-semibold text-md">{appt.title}</span>
                    <span className="text-xs">{appt.start} - {appt.end}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
