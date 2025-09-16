export enum PluginConfigFieldType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  SECRET_STRING = "secret-string",
  SECRET_NUMBER = "secret-number",
  SECRET_BOOLEAN = "secret-boolean",
}
export type PluginConfigSchema<T> = Record<keyof T, PluginConfigFieldType>;