import z from "zod";

const envSchema = z.object({
  ARANGODB_URL: z.string().url(),
  ARANGODB_DATABASE: z.string(),
  ARANGODB_USERNAME: z.string(),
  ARANGODB_PASSWORD: z.string(),
  ARANGODB_VECTOR_COLLECTION: z.string().default("vectors"),

  GEMINI_API_KEY: z.string(),

  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
  S3_PUBLIC_BASE_URL: z.string().optional(),
  S3_DEFAULT_BUCKET: z.string().optional(),

  APP_PORT: z.coerce.number().default(3000),

  TENANT_ID: z.string().uuid(),
});

export const env = envSchema.parse(process.env);