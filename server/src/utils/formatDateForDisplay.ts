import {
  differenceInCalendarDays,
  format,
  isToday,
  isYesterday,
} from "date-fns";

export const formatDateForDisplay = (date: Date): string => {
  if (isToday(date)) {
    return format(date, "hh:mm aa");
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (differenceInCalendarDays(new Date(), date) <= 7) {
    return format(date, "EEEE");
  } else {
    return format(date, "d/M/yyyy");
  }
};
