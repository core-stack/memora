"use strict";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { env } from "./env";
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

// Configure the SDK to export telemetry data to the console
// Enable all auto-instrumentations from the meta package

const traceExporter = new OTLPTraceExporter({
  url: "http://localhost:4317"
});

const sdk = new NodeSDK({
  traceExporter,
  metricReaders: [
    new PrometheusExporter({ port: 8081 })
  ],
  instrumentations: [
    new ExpressInstrumentation,
    new HttpInstrumentation,
    new NestInstrumentation
  ],
  serviceName: "nest"
});

if (env.ENABLE_TRACING) {
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
