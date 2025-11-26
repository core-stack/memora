import { Logger, LogLevel } from "@nestjs/common";

Object.defineProperty(Object.prototype, "$log", {
  value: function(
    opts: { type?: LogLevel; logger?: Logger; enabled?: boolean } = {}
  ) {
    if (opts.enabled === false) return this;

    const { type = "log", logger = new Logger() } = opts;

    logger[type](this);

    return this;
  },
  enumerable: false,
  configurable: true
});
