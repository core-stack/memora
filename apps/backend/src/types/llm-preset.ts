import { Field } from "@/shared/model";

enum LLMType {
  EMBEDDING = "EMBEDDING",
  TEXT = "TEXT",
}

export class LLMPreset {
  @Field({ type: "string", description: "The unique identifier of the LLM preset." })
  key: string;

  @Field({ type: "string", description: "The name of the LLM preset." })
  name: string;

  @Field({ type: "string", description: "A description of the LLM preset.", example: "A state-of-the-art LLM for general reasoning." })
  description: string;

  @Field({ type: "string", description: "The URL or path of the icon representing the LLM." })
  iconPath: string;

  @Field({
    type: "object",
    additionalProperties: {
      type: "string",
      enum: [ "string", "secret-string" ]
    },
    example: {
      apiKey: "secret-string",
      model: "string"
    },
    required: false
  })
  fields: Record<string, "string" | "secret-string">;

  @Field({
    type: "object",
    additionalProperties: {
      type: "string"
    },
    example: {
      model: "gpt-4",
      temperature: 0.7
    },
    required: false
  })
  defaults: Record<string, any>;

  @Field({ type: "string", isArray: true, required: false, description: "List of required field names.", example: [ "apiKey", "model" ] })
  required: string[];

  @Field({ type: "string", description: "Name of the adapter responsible for executing the LLM.", example: "openai" })
  adapter: string;

  @Field({
    type: "boolean",
    default: false,
    description: "Indicates if should ignore received fields in the request."
  })
  ignoreFields: boolean;

  @Field({
    type: "object",
    description: "Adapter configuration.",
    additionalProperties: true,
    example: {
      type: LLMType.TEXT,
      baseUrl: "https://api.openai.com/v1",
      timeout: 30000
    },
    required: false
  })
  config: Record<string, string | number | boolean>;

  constructor(data: LLMPreset) {
    Object.assign(this, data);
  }

  static fromObject(obj: any[]): LLMPreset[];
  static fromObject(obj: any): LLMPreset;
  static fromObject(obj: any | any[]): LLMPreset | LLMPreset[] {
    if (Array.isArray(obj)) {
      return obj.map(item => new LLMPreset(item));
    }
    return new LLMPreset(obj);
  }
}
