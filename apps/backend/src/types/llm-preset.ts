export class LLMPreset {
  name: string;
  description: string;
  iconPath: string;
  fields: Record<string, 'string' | 'secret-string'>;
  defaults: Record<string, any>;
  required: string[];
  adapter: string;
  config: Record<string, any>;

  constructor(data: LLMPreset) {
    Object.assign(this, data);
  }

  static fromObject(obj: any[]): LLMPreset[]
  static fromObject(obj: any): LLMPreset
  static fromObject(obj: any | any[]): LLMPreset | LLMPreset[] {
    if (Array.isArray(obj)) {
      return obj.map(item => new LLMPreset(item));
    } else {
      return new LLMPreset(obj);
    }
  }
}