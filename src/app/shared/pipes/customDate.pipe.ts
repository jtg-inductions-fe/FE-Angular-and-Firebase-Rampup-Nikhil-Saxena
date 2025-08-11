import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

import { format } from 'date-fns';

/**
 * A custom Angular pipe to format a Date or Timestamp into a readable date format: "28 July 2025".
 *
 * This pipe handles both JavaScript `Date` objects and Firestore `Timestamp`.
 * It returns an empty string for invalid or null values.
 */
@Pipe({
  name: 'dateTransform',
})
export class DateTransform implements PipeTransform {
  /**
   * Transforms a date input into the format "DD Month YYYY", e.g., "28 July 2025".
   *
   * @param value - A Date object or Firestore Timestamp to be formatted.
   * @returns A formatted date string or an empty string if the input is invalid.
   */
  transform(value: Date | Timestamp): string {
    if (!value) return '';

    let date: Date;

    if (value instanceof Timestamp) {
      date = value.toDate(); // Firestore Timestamp → JS Date
    } else {
      date = value;
    }

    if (isNaN(date.getTime())) return ''; // Invalid date check

    return format(date, 'd MMMM yyyy'); // date-fns formatting
  }
}
