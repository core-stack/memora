import { z } from 'zod';

const envSchema = z.object({
  STORAGE_URL: z.string().url().optional().default("http://localhost:9000")
});

export const env = envSchema.parse(import.meta.env);