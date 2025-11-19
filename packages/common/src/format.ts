import moment from 'moment';

export const formatBytes = (bytes: number | string | undefined) => {
  if (bytes === undefined) return "0 B";
  const bytesNumber = typeof bytes === 'string' ? parseInt(bytes) : bytes;
  const k = 1024;
  if (bytesNumber < k) {
    return `${bytesNumber} B`;
  } else if (bytesNumber < k * k) {
    return `${(bytesNumber / 1024).toFixed(2)} KB`;
  } else if (bytesNumber < k * k * k) {
    return `${(bytesNumber / 1048576).toFixed(2)} MB`;
  } else {
    return `${(bytesNumber / 1073741824).toFixed(2)} GB`;
  }
}

export const formatDuration = (seconds: number | undefined): string => {
  if (seconds === undefined) return "0:00"
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}


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
 * console.log(formatDate(new Date(), DateFormat.DATE_TIME)) // "2025-09-27 14:35:20"
 * ```
 */
export const formatDate = (date: Date | string | number | undefined, format: DateFormat): string => {
  return moment(date).format(format);
}