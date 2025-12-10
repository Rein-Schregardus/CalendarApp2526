import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { format, parse, parseISO, isSameDay, getDay, addDays, formatDate, addMonths, subMonths } from "date-fns";

import DropdownButton from "../Dropdown/DropdownButton";
import DropdownItem from "../Dropdown/DropdownItem";
import SmallButton from "../SmallButton";
import MonthDisplay from "./MonthDisplay";

import { useMinuteClock } from "@/hooks/useMinuteClock";
import { getMonthByDate, getWeekByDate } from "@/utils/dateUtils";

interface ScheduleProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

type TAppointment = {
  id: number,
  title: string,
  color: string,
  date: string,
  start: string,
  end: string
}

const Schedule = ({ date, setDate }: ScheduleProps) => {
  const [week, setWeek] = useState(getWeekByDate(new Date()));
  const [viewType, setViewType] = useState<"Month"|"Week"|"Day">("Week");
  const [gridZoom, setGridZoom] = useState<number>(+(localStorage.getItem("data-schedual-zoom") || 100));

  // Helper method to store the zoom in local storage.
  const setGridZoomLocalStorage = (zoom: number) => {
    localStorage.setItem("data-schedual-zoom", zoom.toString())
    setGridZoom(zoom)
  }

  const now = useMinuteClock();

  const hours: string[] =
  [ "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00",
    "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
    "21:00", "22:00", "23:00" ];
  const gridHeight = 80;

  const [appointments, setAppointments] = useState<TAppointment[]>([
    { id: 1, title: "Team Meeting", color: "#f94449", date: "2025-10-13", start: "09:00", end: "12:00" },
    { id: 2, title: "Client Call", color: "#72bf6a", date: "2025-10-13", start: "13:00", end: "15:30" },
    { id: 3, title: "Design Review", color: "#4a90e2", date: "2025-10-14", start: "10:00", end: "14:00" },
    { id: 4, title: "Project Planning", color: "#f0c419", date: "2025-10-14", start: "15:00", end: "16:30" },
    { id: 5, title: "Code Review", color: "#f94449", date: "2025-10-15", start: "11:00", end: "12:00" },
    { id: 6, title: "Marketing Sync", color: "#72bf6a", date: "2025-10-15", start: "14:00", end: "17:30" },
    { id: 7, title: "Team Meeting", color: "#4a90e2", date: "2025-10-16", start: "09:00", end: "10:30" },
    { id: 8, title: "Brainstorm Session", color: "#f0c419", date: "2025-10-16", start: "13:00", end: "15:00" },
    { id: 9, title: "1:1 with Manager", color: "#f94449", date: "2025-10-17", start: "10:00", end: "11:30" },
    { id: 10, title: "Product Demo", color: "#72bf6a", date: "2025-10-17", start: "13:00", end: "14:00" },
    { id: 11, title: "Workshop", color: "#4a90e2", date: "2025-10-18", start: "09:00", end: "12:00" },
    { id: 12, title: "Weekly Report", color: "#f0c419", date: "2025-10-18", start: "14:00", end: "15:00" },
    { id: 13, title: "Team Lunch", color: "#f94449", date: "2025-10-19", start: "12:00", end: "13:30" },
    { id: 14, title: "Presentation", color: "#72bf6a", date: "2025-10-20", start: "09:00", end: "11:40" },
    { id: 15, title: "QA Testing", color: "#4a90e2", date: "2025-10-21", start: "13:00", end: "15:30" },
    { id: 16, title: "Sprint Retrospective", color: "#f0c419", date: "2025-10-22", start: "10:00", end: "11:30" },
    { id: 17, title: "Design Workshop", color: "#f94449", date: "2025-10-23", start: "09:30", end: "11:00" },
    { id: 18, title: "Dev Sync", color: "#72bf6a", date: "2025-10-23", start: "15:00", end: "16:00" },
    { id: 19, title: "Customer Feedback", color: "#4a90e2", date: "2025-10-24", start: "10:00", end: "11:00" },
    { id: 20, title: "Performance Review", color: "#f0c419", date: "2025-10-25", start: "14:00", end: "15:30" },
    { id: 21, title: "Hackathon", color: "#f94449", date: "2025-10-26", start: "08:00", end: "12:00" },
    { id: 22, title: "Team Wrap-up", color: "#72bf6a", date: "2025-12-10", start: "16:00", end: "18:00" },
  ]);


  const ScrollContainerRef = useRef<HTMLDivElement>(null);
  const timeLineRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  const timeToPixels = (time: Date) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return ((hours + minutes / 60) * gridHeight / 100) * gridZoom;
  };

  const increaseGridZoom = () => setGridZoomLocalStorage(Math.min(gridZoom + 10, 150));
  const decreaseGridZoom = () => setGridZoomLocalStorage(Math.max(gridZoom - 10, 30));


  // Scroll schedule to current time
  useEffect(() => {
    if (!hasScrolled.current && timeLineRef.current) {
      timeLineRef.current.scrollIntoView({ block: "center" });
      hasScrolled.current = true;
    }
  }, []);

  useEffect(() => {
    let week: Date[];
    switch (viewType) {
      case "Month":
        week = getMonthByDate(date);
        break;
      case "Day":
        week = [date];
        break;
      default: // defaults to week
        week = getWeekByDate(date);
        break;
    }

    setWeek(week);
  }, [date,viewType]);

  return (
    <div className="bg-primary rounded-xl p-4 shadow-md h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-8">
          <button className="flex items-center border border-secondary rounded-full h-10 px-2 md:px-8 cursor-pointer hover:bg-secondary transition" onClick={() => setDate(new Date(Date.now()))}>
            <span className="text-base">Today</span>
          </button>

          <div className="flex items-center justify-center gap-1">
            <SmallButton onClick={() => {
              switch (viewType)
              {
                case "Month":
                  setDate((subMonths(date, 1)))
                  break;

                case "Day":
                  setDate(addDays(date, -1))
                  break;

                default:
                  setDate(addDays(date, -7))
                  break;
              }
              }}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </SmallButton>
            <SmallButton onClick={() => {
              switch (viewType)
              {
                case "Month":
                  setDate((addMonths(date, 1)))
                  break;

                case "Day":
                  setDate(addDays(date, 1))
                  break;

                default:
                  setDate(addDays(date, 7))
                  break;
              }
              }}>
              <FontAwesomeIcon icon={faChevronRight} />
            </SmallButton>
          </div>

          {}
        <div className="hidden lg:inline"><MonthDisplay date={date}/></div>

        </div>

        {/* Right section */}
        <div className="flex gap-4 items-center">
          {/* Zoom controls */}
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={decreaseGridZoom}
              className="flex items-center justify-center p-2 rounded-sm border border-secondary cursor-pointer"
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <span className="hidden md:inline">{gridZoom}%</span>
            <button
              type="button"
              onClick={increaseGridZoom}
              className="flex items-center justify-center p-2 rounded-sm border border-secondary cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          {/* View Dropdown */}
          <DropdownButton
            label={viewType}
            className="flex items-center justify-between gap-2 border border-secondary rounded-full min-w-20 h-10 px-4 cursor-pointer hover:bg-secondary transition"
          >
            <DropdownItem onClick={() =>setViewType("Day")}>Day</DropdownItem>
            <DropdownItem onClick={() => setViewType("Week")}>Week</DropdownItem>
            <DropdownItem onClick={() => setViewType("Month")}>Month</DropdownItem>
          </DropdownButton>
        </div>
      </div>

      <hr className="my-4 text-secondary" />

      {/* Weekdays header */}
      <div className="flex w-full">
        <div
          className="grid pl-16 w-full border-secondary"
          style={{
            gridTemplateColumns: `repeat(${week.length}, 1fr)`,
            gridTemplateRows: "64px",
          }}
        >
          {week.map((weekday, i) => (
            <div key={formatDate(weekday, "dd:EEE") + i.toString()} className="flex flex-col items-center justify-center overflow-hidden">
              <span>{formatDate(weekday, "EEE")}</span>
              <span>{format(week[i], 'd')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule content */}
      <div className="flex w-full flex-1 overflow-hidden">
        <div
          ref={ScrollContainerRef}
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
              className="grid w-full border-secondary"
              style={{
                gridTemplateColumns: `repeat(${week.length}, 1fr)`,
                gridTemplateRows: `repeat(${hours.length}, ${gridHeight / 100 * gridZoom}px)`,
              }}
            >
              {hours.map((hour) =>
                week.map((day) => (
                  <div
                    key={`${day}-${hour}`}
                    className="border-b border-r border-secondary text-gray-500"
                  ></div>
                ))
              )}
            </div>

            {/* Appointment layer */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {appointments.map((appt) => {
                const startDate = parse(appt.start, "HH:mm", new Date());
                const endDate = parse(appt.end, "HH:mm", new Date());
                const top = timeToPixels(startDate);
                const height = timeToPixels(endDate) - top;

                const dateObj = parseISO(appt.date);

                if (!week.some(date => isSameDay(date, dateObj)))
                {
                    return null;
                }

                const columnWidth = 100 / week.length;
                const left = `${(getDay(dateObj) + 6) % week.length * columnWidth}%`;

                return (
                  <div
                    key={appt.id}
                    className="absolute flex flex-col text-primary text-sm rounded-lg p-2 shadow-md pointer-events-auto cursor-pointer"
                    style={{
                      backgroundColor: appt.color,
                      top,
                      height,
                      left,
                      width: `calc(${columnWidth}% - 8px)`,
                      marginLeft: "4px",
                    }}
                  >
                    <span className="font-semibold text-md">{appt.title}</span>
                    <span className="text-xs">
                      {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Current time line */}
            {
              week.some(d => d.toDateString() === new Date(Date.now()).toDateString()) &&
            <div
              ref={timeLineRef}
              className="absolute bg-red-500 h-[2px] shadow-md"
              style={{
                top: timeToPixels(now),
                width: `calc(${100 / week.length}%)`,
                left: `${(getDay(Date.now()) + 6) % week.length * 100 / week.length}%`,
              }}
            >
              <span className="absolute bg-red-500 text-primary text-xs font-semibold p-1 rounded-b-lg rounded-tl-lg -left-6 shadow-md">
                {format(now, "HH:mm")}
              </span>
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
