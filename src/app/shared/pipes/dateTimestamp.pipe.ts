import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

/**
 * A Custom Pipe to convert Data | Time into Date
 */
@Pipe({
  name: 'dateTimestampPipe',
})
export class DateTimestampPipe implements PipeTransform {
  /**
   * Transform type Date | Time into Date
   *
   * @param value - A Date or Timestamp
   * @returns A Date
   */
  transform(value: Date | Timestamp): Date {
    if (typeof value === typeof Date) {
      return value as Date;
    } else {
      return new Date(
        new Date((value as Timestamp).seconds * 1000).setHours(0, 0, 0, 0)
      );
    }
  }
}
