import { AnyColumn, sql } from 'drizzle-orm';

export const increment = (col: AnyColumn, value = 1) => {
  return sql`${col} + ${value}`
}