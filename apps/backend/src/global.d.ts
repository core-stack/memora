import { Logger } from "@nestjs/common";

export {};

declare global {
  interface Object {
    $log<T>(
      this: T,
      opts?: { type: "log" | "warn" | "debug" | "verbose" | "error", logger?: Logger, enabled?: boolean }
    ): T;
  }
}
