import dotenv from 'dotenv';
import path from 'path';
import z from 'zod';

dotenv.config({
  path: [".env", "../../.env", "../../.env.local"],
});

const envSchema = z.object({
  // APP
  APP_PORT: z.coerce.number().default(3000),
  API_URL: z.string().url().optional().default("http://localhost:3000/api"),

  // PLUGIN
  PLUGINS_DIR: z.string().optional().default(path.join(__dirname, "..", "..", "plugins")),
  PLUGINS_BUCKET: z.string().optional().default("plugins"),

  // CORS
  CORS_ORIGINS: z.string().transform((s) => s.split(",")).array().optional().default(["*", "http://localhost:3000", "http://localhost:5173"]),
  CORS_METHODS: z.string().array().optional().default(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]),
  CORS_HEADERS: z.string().array().optional().default(["*"]),
  CORS_CREDENTIALS: z.boolean().optional().default(true),

  // DATABASE
  DATABASE_URL: z.string(),

  TENANT_ID: z.string().uuid(),
  
  // STORAGE
  STORAGE_TYPE: z.enum(['s3']).default('s3'),
  // S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_ENDPOINT: z.string().optional(),
  AWS_PUBLIC_BUCKET_BASE_URL: z.string().optional(),
  AWS_BUCKET: z.string().optional(),
  AWS_FORCE_PATH_STYLE: z.coerce.boolean().optional().default(false),
  
  // REDIS
  REDIS_HOST: z.string().optional().default("localhost"),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_USER: z.string().optional().default("default"),
  REDIS_PASSWORD: z.string().optional().default(""),
  REDIS_DB: z.coerce.number().optional().default(0),

  // BULLBOARD
  BULL_BOARD_USER: z.string().optional().default("admin"),
  BULL_BOARD_PASSWORD: z.string().optional().default("admin"),

  // EMBEDDINGS
  EMBEDDING_ENGINE: z.enum(['gemini']).default('gemini'),
  EMBEDDING_DIMENSION: z.coerce.number().optional().default(3072),
  EMBEDDING_MODEL: z.string().optional().default("gemini-embedding-001"),

  // GEMINI
  GEMINI_API_KEY: z.string(),
  GEMINI_MODEL: z.string().optional().default("gemini-1.5-flash"),
  
  // VECTOR
  VECTOR_ENGINE: z.enum(['milvus']).default('milvus'),
  // MILVUS
  MILVUS_URL: z.string().url().optional().default("localhost:19530"),
  MILVUS_COLLECTION: z.string().optional().default("default"),
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