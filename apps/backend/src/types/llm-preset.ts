import { ApiProperty } from "@nestjs/swagger";

export class LLMPreset {
  @ApiProperty({
    example: "OpenAI GPT-4",
    description: "The name of the LLM preset."
  })
  name: string;

  @ApiProperty({
    example: "A state-of-the-art LLM for general reasoning.",
    description: "A description of the LLM preset."
  })
  description: string;

  @ApiProperty({
    example: "https://cdn.example.com/icons/gpt4.png",
    description: "The URL or path of the icon representing the LLM."
  })
  iconPath: string;

  @ApiProperty({
    description: "Fields required to configure this LLM.",
    example: {
      apiKey: "secret-string",
      model: "string"
    },
    type: "object",
    additionalProperties: {
      type: "string",
      enum: [ "string", "secret-string" ]
    }
  })
  fields: Record<string, "string" | "secret-string">;

  @ApiProperty({
    description: "Default values for any configuration fields.",
    example: {
      model: "gpt-4",
      temperature: 0.7
    },
    type: "object",
    additionalProperties: true
  })
  defaults: Record<string, any>;

  @ApiProperty({
    description: "List of required field names.",
    example: [ "apiKey", "model" ],
    type: "array",
    items: { type: "string" }
  })
  required: string[];

  @ApiProperty({
    description: "Name of the adapter responsible for executing the LLM.",
    example: "openai"
  })
  adapter: string;

  @ApiProperty({
    description: "Adapter configuration.",
    example: {
      baseUrl: "https://api.openai.com/v1",
      timeout: 30000
    },
    type: "object",
    additionalProperties: true
  })
  config: Record<string, any>;

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
