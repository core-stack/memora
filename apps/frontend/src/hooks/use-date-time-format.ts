import moment from 'moment';

/**
 * Date format supported.
 * Each format is based on `moment`.
 */
export enum DateFormat {
  /** Only date, ex: `2025-09-27` */
  DATE = 'YYYY-MM-DD',

  /** Date + time, ex: `2025-09-27 14:35:20` */
  DATE_TIME = 'YYYY-MM-DD HH:mm:ss',

  /** Only time, ex: `14:35:20` */
  TIME = 'HH:mm:ss',

  /** Short local, ex: `Sep 27, 2025 2:35 PM` */
  lll = 'lll',

  /** Medium local, ex: `September 27, 2025 2:35 PM` */
  LLL = 'LLL',

  /** Long local, ex: `Saturday, September 27, 2025 2:35 PM` */
  LLLL = 'LLLL',

  /** Long local, ex: `Sat, Sep 27, 2025 2:35 PM` */
  llll = 'llll',
}

/**
 * Format date based on {@link DateFormat}.
 *
 * @param date Date to format (Date, timestamp ou string).
 * @param format Format to use {@link DateFormat}.
 * @returns Formatted date.
 *
 * @example
 * ```ts
 * const formatDate = useDateTimeFormat()
 * console.log(formatDate(new Date(), DateFormat.DATE_TIME)) // "2025-09-27 14:35:20"
 * ```
 */
export const useDateTimeFormat = () => {
  return (date: Date | string | number | undefined, format: DateFormat): string => {
    return moment(date).format(format);
  }
}
