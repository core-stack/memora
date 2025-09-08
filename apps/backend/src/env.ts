import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),

  ARANGODB_URL: z.string().url(),
  ARANGODB_DATABASE: z.string(),
  ARANGODB_USERNAME: z.string(),
  ARANGODB_PASSWORD: z.string(),
  ARANGODB_VECTOR_COLLECTION: z.string().default("vectors"),

  GEMINI_API_KEY: z.string(),

  APP_PORT: z.coerce.number().default(3000),

  TENANT_ID: z.string().uuid(),

  STORAGE_TYPE: z.enum(['s3', 'local']).default('local'),

  // Local
  LOCAL_STORAGE_PATH: z.string().optional().default(`${process.cwd()}/files`),

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