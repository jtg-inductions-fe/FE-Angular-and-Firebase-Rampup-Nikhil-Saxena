import { Pipe, PipeTransform } from '@angular/core';

/**
 * A custom Angular pipe to format a Date or ISO string into a readable date format: "28 July 2025".
 *
 * This pipe handles both JavaScript `Date` objects and ISO date strings.
 * It returns an empty string for invalid or null values.
 */
@Pipe({
  name: 'customDate',
})
export class CustomDatePipe implements PipeTransform {
  /**
   * Transforms a date input into the format "DD Month YYYY", e.g., "28 July 2025".
   *
   * @param value - A Date object or ISO string to be formatted.
   * @returns A formatted date string or an empty string if the input is invalid.
   */
  transform(value: Date | string | null): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;

    if (isNaN(date.getTime())) return ''; // Invalid date check

    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  }
}
