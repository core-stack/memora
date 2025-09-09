import dotenv from 'dotenv';
import z from 'zod';

dotenv.config({
  path: [".env", "../../.env", "../../.env.local"],
});

const envSchema = z.object({
  DATABASE_URL: z.string(),

  GEMINI_API_KEY: z.string(),

  APP_PORT: z.coerce.number().default(3000),

  TENANT_ID: z.string().uuid(),

  STORAGE_TYPE: z.enum(['s3']).default('s3'),

  // S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_ENDPOINT: z.string().optional(),
  AWS_PUBLIC_BUCKET_BASE_URL: z.string().optional(),
  AWS_BUCKET: z.string().optional(),
  AWS_FORCE_PATH_STYLE: z.coerce.boolean().optional().default(false),

  API_URL: z.string().url().optional(),

  // CORS
  CORS_ORIGINS: z.string().transform((s) => s.split(",")).array().optional().default(["*", "http://localhost:3000", "http://localhost:5173"]),
  CORS_METHODS: z.string().array().optional().default(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]),
  CORS_HEADERS: z.string().array().optional().default(["*"]),
  CORS_CREDENTIALS: z.boolean().optional().default(true),

  // BULL
  REDIS_HOST: z.string().optional().default("localhost"),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_USER: z.string().optional().default("default"),
  REDIS_PASSWORD: z.string().optional().default(""),
  REDIS_DB: z.coerce.number().optional().default(0),
  BULL_BOARD_USER: z.string().optional().default("admin"),
  BULL_BOARD_PASSWORD: z.string().optional().default("admin"),

  // Vector
  QDRANT_URL: z.string().optional().default("http://127.0.0.1:6333"),
  QDRANT_COLLECTION: z.string().optional().default("default"),
}).transform((data) => {
  if (!data.API_URL) {
    return {
      ...data,
      API_URL: `http://localhost:${data.APP_PORT}/api`,
    };
  }
  return data;
}).superRefine((data, ctx) => {
  if (data.STORAGE_TYPE === 's3') {
    if (!data.AWS_ACCESS_KEY_ID &&
      !data.AWS_SECRET_ACCESS_KEY &&
      !data.AWS_REGION &&
      !data.AWS_ENDPOINT &&
      !data.AWS_PUBLIC_BUCKET_BASE_URL &&
      !data.AWS_BUCKET) {
        ctx.addIssue({ code: "custom", message: "AWS storage is not configured" });
      }
  }
});

export const env = envSchema.parse(process.env);