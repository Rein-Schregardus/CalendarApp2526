import React, { useMemo } from "react";
import { getWeekByDate } from "../../utils/dateUtils";

interface MonthDisplayProps {
  date: Date;
}

const MonthDisplay: React.FC<MonthDisplayProps> = ({ date }) => {
  const monthLabel = useMemo(() => {
    const week = getWeekByDate(date);

    const months = week.map(d => d.getMonth());
    const years = week.map(d => d.getFullYear());

    const uniqueMonths = [...new Set(months)];
    const uniqueYears = [...new Set(years)];

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    if (uniqueMonths.length === 1 && uniqueYears.length === 1) {
      return `${monthNames[uniqueMonths[0]]} ${uniqueYears[0]}`;
    }

    if (uniqueYears.length === 1 && uniqueMonths.length > 1) {
      return `${monthNames[uniqueMonths[0]]} / ${monthNames[uniqueMonths[uniqueMonths.length - 1]]} ${uniqueYears[0]}`;
    }

    const first = week[0];
    const last = week[week.length - 1];
    return `${monthNames[first.getMonth()]} ${first.getFullYear()} / ${monthNames[last.getMonth()]} ${last.getFullYear()}`;
  }, [date]);

  return (
    <h2 className="text-lg font-semibold">{monthLabel}</h2>
  );
};

export default MonthDisplay;
