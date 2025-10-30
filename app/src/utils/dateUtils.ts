import { startOfWeek, endOfWeek, eachDayOfInterval, getDay, startOfMonth, subMonths, endOfMonth, subDays} from "date-fns";

/**
 * Returns an array of Date objects representing all days in the same week as the given date.
 * @param date - Any Date
 * @param weekStartsOn - Optional: which weekday to start on (0 = Sunday, 1 = Monday, etc.)
 */
export const getWeekByDate = (date: Date): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end });
};


/**
 * Generates an array of 42 Date objects representing a full calendar grid for a given month.
 * The array includes:
 *   - The last few days of the previous month (if the first day of the month does not start on Monday)
 *   - All days of the specified month
 *   - The first few days of the next month (to complete a 6x7 calendar grid)
 *
 * @param year - The full year (e.g., 2025)
 * @param month - The month index (0 = January, 11 = December)
 * @returns An array of 42 Date objects for rendering a month calendar grid.
 *
 * @example
 * generateDays(2025, 9); // Generates calendar grid for October 2025
 */
export const generateDays = (year: number, month: number): Date[] => {
  const days: Date[] = [];

  const firstDayOfMonth = startOfMonth(new Date(year, month, 1));
  const weekdayIndex = (getDay(firstDayOfMonth) + 6) % 7; // Monday=0, Sunday=6

  if (weekdayIndex != 0) {
    // Retrieve last days of previous month
    const lastDayPrevMonth = endOfMonth(subMonths(new Date(year, month, 1), 1));
    const firstDayPrevMonthRange = subDays(lastDayPrevMonth, weekdayIndex - 1);

    // Last dates of previous month to fill the calendar grid
    const lastDaysPrevMonth = eachDayOfInterval({
      start: firstDayPrevMonthRange,
      end: lastDayPrevMonth,
    });

    days.push(...lastDaysPrevMonth);
  }

  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }

  // Fill remaining days
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
};