import z from "zod";

const envSchema = z.object({
  ARANGODB_URL: z.string().url(),
  ARANGODB_DATABASE: z.string(),
  ARANGODB_USERNAME: z.string(),
  ARANGODB_PASSWORD: z.string(),
  ARANGODB_VECTOR_COLLECTION: z.string().default("vectors"),
  GEMINI_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);