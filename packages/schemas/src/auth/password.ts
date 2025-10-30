import { z } from 'zod';

export const passwordSchema = z.string({ message: ("The password is required") })
  .min(6, ("The password must be at least 6 characters"))
  .max(100, ("The password must be at most 100 characters"));
