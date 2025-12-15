import { useState, useRef, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faPlus, faMinus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { format, parseISO, isSameDay, getDay, addDays, formatDate, addMonths, subMonths, addMinutes, subDays, endOfDay, startOfDay } from "date-fns";

import DropdownButton from "../Dropdown/DropdownButton";
import DropdownItem from "../Dropdown/DropdownItem";
import SmallButton from "../SmallButton";
import MonthDisplay from "./MonthDisplay";

import { useMinuteClock } from "@/hooks/useMinuteClock";
import { getMonthByDate, getWeekByDate } from "@/utils/dateUtils";
import { getColor } from "../SchedualColorSettings";
import { UserContext } from "@/hooks/UserContext";
import { GlobalModalContext } from "@/context/GlobalModalContext";
import SchedualItem from "./SchedualItem";
import type { TSchedualItem } from "@/types/TSchedualItem";

interface ScheduleProps {
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  date: Date;
}



const Schedule = ({ setDate, date }: ScheduleProps) => {
  const [week, setWeek] = useState(getWeekByDate(new Date()));
  const [viewType, setViewType] = useState<"Month" | "Week" | "Day">("Week");
  const [gridZoom, setGridZoom] = useState<number>(+(localStorage.getItem("data-schedual-zoom") || 100));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userContext = useContext(UserContext);
  const modalContext = useContext(GlobalModalContext);

  // Helper method to store the zoom in local storage.
  const setGridZoomLocalStorage = (zoom: number) => {
    localStorage.setItem("data-schedual-zoom", zoom.toString())
    setGridZoom(zoom)
  }

  const now = useMinuteClock();

  const hours: string[] =
    ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00",
      "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
      "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
      "21:00", "22:00", "23:00"];
  const gridHeight = 80;

  const [schedualItemsCache, setSchedualItemsCache] = useState<Map<Date, TSchedualItem[]>>();

  const [schedualItems, setSchedualItems] = useState<TSchedualItem[]>();


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

  // fetches new schedual items from the backend
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
    GetSchedualItems(week[0], week[week.length - 1]);

  }, [date, viewType,  modalContext.isModalOpen]);

  // updates the visable schedualitems from the cache
  useEffect(() => {
    let visableItems: TSchedualItem[] = [];
    schedualItemsCache?.forEach((val, key) => {
      if ( key >= startOfDay(week[0]) && key <= endOfDay(week[week.length - 1]))
      {
        visableItems = [...visableItems, ...val]
      }
    })
    setSchedualItems(visableItems);
  }, [
    schedualItemsCache, date, viewType
  ])


  // communicate with backend
  const GetSchedualItems = async (start: Date, end: Date): Promise<void> => {
    const user = await userContext.getCurrUserAsync();

    const response = await fetch(`http://localhost:5005/schedual/between/${user?.id}/${subDays(start, 2).toISOString()}/${addDays(end, 2).toISOString()}`, { credentials: "include" });

    const body = await response.json();
    const mapped: Map<Date, TSchedualItem[]> = new Map<Date, TSchedualItem[]>();

    Object.entries(body).forEach(([dateString, appointments]) => {
      const date = new Date(dateString); // convert key to Date

      const typedAppointments = (appointments as any[]).map(a => ({
        id: a.id,
        title: a.title,
        color: a.color,
        start: parseISO(a.start),
        duration: a.duration,
        type: ["Event", "RoomReservation"][a.type]
      })) as TSchedualItem[];

      mapped.set(date, typedAppointments);
    })

    setSchedualItemsCache(mapped);
    setIsLoading(false);
    return;
  }


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
              switch (viewType) {
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
              switch (viewType) {
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
          <div className="hidden lg:inline"><MonthDisplay date={date} /></div>

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
            <DropdownItem onClick={() => setViewType("Day")}>Day</DropdownItem>
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
      {
        isLoading ?
          <div className="flex justify-center items-center w-full md:h-full">
            <div className=" text-lg lg:text-5xl font-light">Loading Your Appointments <FontAwesomeIcon icon={faSpinner} className="text-4xl animate-spin" /></div>
          </div>
          :
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
                  {
                    schedualItems?.map((appt) => {
                    const startDate = appt.start;
                    const endDate = addMinutes(startDate, appt.duration);
                    const top = timeToPixels(startDate);
                    const height = timeToPixels(endDate) - top;
                    const dateObj = appt.start;

                    if (!week.some(date => isSameDay(date, dateObj))) {
                      return null;
                    }

                    const columnWidth = 100 / week.length;
                    const left = `${(getDay(dateObj) + 6) % week.length * columnWidth}%`;

                    return (
                      <SchedualItem item={appt} top={top} height={height} left={left} columnWidth={columnWidth}/>
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
      }
    </div>
  );
};

export default Schedule;
