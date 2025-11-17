import dotenv from 'dotenv';
import moment from 'moment';
import path from 'path';
import z from 'zod';

import { __root } from './root';

const envFile = process.env.ENV_FILE;

const buildEnvPaths = (envFile?: string) => {
  if (envFile) {
    return [envFile, `../../${envFile}`];
  }
  return [".env", "../../.env", "../../.env.local"];
}

dotenv.config({
  path: buildEnvPaths(envFile),
});

const envSchema = z.object({
  // APP
  APP_PORT: z.coerce.number().default(3000),
  API_URL: z.url().optional().default("http://localhost:3000/api"),
  SERVE_STATIC_PATH: z.string().optional(),
  FRONTEND_URL: z.url().optional().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // INVITE
  DEFAULT_INVITE_EXPIRES: z.coerce.number().optional().default(60 * 60 * 24), // 1 day

  // AUTH
  REQUIRE_EMAIL_VERIFICATION: z.coerce.boolean().optional().default(false),
  STORE: z.enum(["memory", "redis"]).default("redis"),
  REDIS_STORE_URL: z.url().optional().default("redis://localhost:6379"),

  // OAUTH
  GOOGLE_ENABLED: z.coerce.boolean().default(false),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),

  // JWT
  JWT_SECRET: z.string().default("change-me"),
  JWT_ACCESS_TOKEN_DURATION: z.coerce.number().default(60 * 5 * 1000), // 5 min
  JWT_REFRESH_TOKEN_DURATION: z.coerce.number().default(60 * 60 * 24 * 30 * 1000), // 30 days

  // SMTP
  SMTP_ENABLED: z.coerce.boolean().default(false),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional(),
  SMTP_ENV: z.enum(["development", "production", "test"]).default("development"),
  SMTP_TEST_EMAIL: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),

  ACTIVE_ACCOUNT_TOKEN_EXPIRES_IN: z.coerce.number().optional().default(60 * 60 * 24), // 1 day
  RESET_PASSWORD_TOKEN_EXPIRES_IN: z.coerce.number().optional().default(60 * 60), // 1 hour

  // SECURITY
  ENCRYPT_MASTER_PASSWORD: z.string().optional().default("change-me"),

  // PLUGIN
  PLUGINS_DIR: z.string().optional().default(path.join(__dirname, "..", "..", "plugins")),
  PLUGINS_BUCKET: z.string().optional().default("plugins"),

  // CORS
  CORS_ORIGINS: z.string().transform((s) => s.split(",")).optional().default(["*", "http://localhost:3000", "http://localhost:5173"]),
  CORS_METHODS: z.string().array().optional().default(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]),
  CORS_HEADERS: z.string().array().optional().default(["*"]),
  CORS_CREDENTIALS: z.boolean().optional().default(true),

  // DATABASE
  DATABASE_URL: z.string(),
  CREATE_DATABASE: z.coerce.boolean().optional().default(false),

  // STORAGE
  STORAGE_TYPE: z.enum(['s3']).default('s3'),
  DELETE_TEMP_FILES_AFTER: z.coerce.number().optional().default(60 * 60 * 24), // 1 day
  // S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default("us-east-1"),
  AWS_ENDPOINT: z.string().optional(),
  AWS_BUCKET: z.string().default("default"),
  AWS_PUBLIC_BUCKET: z.string().default("public"),
  AWS_FORCE_PATH_STYLE: z.coerce.boolean().optional().default(false),
  AWS_PUBLIC_BASE_URL: z.string().default("http://localhost:9000/public"),

  // REDIS
  REDIS_HOST: z.string().optional().default("localhost"),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_USER: z.string().optional().default("default"),
  REDIS_PASSWORD: z.string().optional().default(""),
  REDIS_DB: z.coerce.number().optional().default(0),

  // BULLBOARD
  BULL_BOARD_USER: z.string().optional().default("admin"),
  BULL_BOARD_PASSWORD: z.string().optional().default("admin"),

  // LLM
  LLM_INSTANCE_LIMIT: z.coerce.number().optional().default(10),
  LLM_INSTANCE_DURATION: z.coerce.number().optional().default(moment().minutes(15).valueOf()),

  // GEMINI
  GEMINI_API_KEY: z.string(),
  GEMINI_MODEL: z.string().optional().default("gemini-2.5-flash"),

  // VECTOR
  VECTOR_ENGINE: z.enum(['milvus']).default('milvus'),
  // MILVUS
  MILVUS_URL: z.url().optional().default("localhost:19530"),
  MILVUS_COLLECTION_PREFIX: z.string().optional().default("snipet"),
  MILVUS_RECREATE_COLLECTION: z.string().transform((s) => s === "true").optional(),

  // PROMPT
  PROMPT_TEMPLATES_DIR: z.string().optional().default(path.join(__root, "prompts")),
  DEBUG_PROMPTS: z.coerce.boolean().optional().default(false),

  IGNORE_PLUGINS: z.coerce.boolean().optional().default(false),
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
    if (!data.AWS_ACCESS_KEY_ID && !data.AWS_SECRET_ACCESS_KEY) {
      ctx.addIssue({ code: "custom", message: "AWS storage is not configured" });
    }
  }
});

export const env = envSchema.parse(process.env);