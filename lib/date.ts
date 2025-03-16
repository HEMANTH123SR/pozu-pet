import {
  differenceInHours,
  differenceInMinutes,
  differenceInDays,
} from "date-fns";

export function formatCompactTime(date: Date) {
  const now = new Date();
  const hours = differenceInHours(now, date);
  const minutes = differenceInMinutes(now, date);
  const days = differenceInDays(now, date);

  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

export function getTimeLeft(targetDateTime: string): string {
  const now = new Date();
  const target = new Date(targetDateTime);

  // Check if the target date is valid
  if (isNaN(target.getTime())) {
    return "Invalid target date.";
  }

  const diff = target.getTime() - now.getTime();

  // If the date has passed
  if (diff <= 0) {
    return "The date has passed.";
  }

  // Calculate differences in various time units
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Approximation
  const years = Math.floor(months / 12);

  // Return the most relevant time unit
  if (years > 0) {
    return years === 1 ? "1 year left" : `${years} years left`;
  }
  if (months > 0) {
    return months === 1 ? "1 month left" : `${months} months left`;
  }
  if (days > 0) {
    return days === 1 ? "1 day left" : `${days} days left`;
  }
  if (hours > 0) {
    return hours === 1 ? "1 hour left" : `${hours} hours left`;
  }
  if (minutes > 0) {
    return minutes === 1 ? "1 minute left" : `${minutes} minutes left`;
  }
  return "Less than a minute left.";
}

export function formatDateRange(
  date1: string | Date,
  date2: string | Date
): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Ensure the inputs are Date objects
  const d1 = typeof date1 === "string" ? new Date(date1) : date1;
  const d2 = typeof date2 === "string" ? new Date(date2) : date2;

  // Extract values for the first date
  const month1 = months[d1.getMonth()];
  const day1 = d1.getDate();

  // Extract values for the second date
  const month2 = months[d2.getMonth()];
  const day2 = d2.getDate();
  const year2 = d2.getFullYear();

  // Format and return the result
  return `${month1} ${day1} - ${month2} ${day2}, ${year2}`;
}

export function dateFormat(date: string | Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Ensure the input is a Date object
  const d = typeof date === "string" ? new Date(date) : date;

  // Extract date parts
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear().toString().slice(-2);

  // Format and return the result
  return `${day} · ${month} · ${year}`;
}
