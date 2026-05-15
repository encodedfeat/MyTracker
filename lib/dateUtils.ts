// lib/dateUtils.ts

/**
 * Fixes timezone issues by standardizing to local YYYY-MM-DD
 * @param date A Date object
 * @returns A string in 'YYYY-MM-DD' format
 */
export function getLocalDateString(date: Date): string {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
  return adjustedDate.toISOString().split('T')[0];
}