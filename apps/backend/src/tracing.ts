"use strict";
import {
  diag,
  DiagConsoleLogger,
  DiagLogLevel
} from "@opentelemetry/api";
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import {
  PeriodicExportingMetricReader
} from "@opentelemetry/sdk-metrics";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { env } from "./env";

// Configure the SDK to export telemetry data to the console
// Enable all auto-instrumentations from the meta package
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const options = {
  url: env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
  compression: CompressionAlgorithm.GZIP
};

const traceExporter = new OTLPTraceExporter(options);

const metricExporter = new OTLPMetricExporter(options);

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: env.OTEL_METRIC_EXPORT_INTERVAL,
  exportTimeoutMillis: env.OTEL_METRIC_EXPORT_TIMEOUT
});

const sdk = new NodeSDK({
  traceExporter,
  metricReader,
  instrumentations: [
    getNodeAutoInstrumentations({}),
    new ExpressInstrumentation,
    new NestInstrumentation
  ]
});

if (env.OTEL_ENABLED) {
  console.log("Tracing enabled");

  // initialize the SDK and register with the OpenTelemetry API
  // this enables the API to record telemetry
  sdk.start();
  // gracefully shut down the SDK on process exit
  process.on("SIGTERM", () => {
    sdk
      .shutdown()
      .then(() => console.log("Tracing terminated"))
      .catch((error) => console.log("Error terminating tracing", error))
      .finally(() => process.exit(0));
  });
}

export default sdk;
