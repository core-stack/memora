import { Constructor } from "@/types/constructor";
import { ErrorResponse } from "./error-response";

export const getDefaultCreateResponses = (entity: Constructor<any>) => [
  { status: 201, description: "Record created successfully", type: entity },
  { status: 400, description: "Bad request", type: ErrorResponse },
  { status: 409, description: "Conflict - duplicate record", type: ErrorResponse },
  { status: 500, description: "Internal server error", type: ErrorResponse }
];

export const getDefaultFindResponses = (entity: Constructor<any>) => [
  { status: 200, description: "Records found successfully", type: entity, isArray: true },
  { status: 400, description: "Bad request", type: ErrorResponse },
  { status: 500, description: "Internal server error", type: ErrorResponse }
];

export const getDefaultFindByIDResponses = (entity: Constructor<any>) => [
  { status: 200, description: "Record found successfully", type: entity },
  { status: 400, description: "Bad request", type: ErrorResponse },
  { status: 404, description: "Record not found", type: ErrorResponse },
  { status: 500, description: "Internal server error", type: ErrorResponse }
];

export const getDefaultUpdateResponses = (entity: Constructor<any>) => [
  { status: 200, description: "Record updated successfully", type: entity },
  { status: 400, description: "Bad request", type: ErrorResponse },
  { status: 404, description: "Record not found", type: ErrorResponse },
  { status: 500, description: "Internal server error", type: ErrorResponse }
];

export const getDefaultDeleteResponses = (entity: Constructor<any>) => [
  { status: 200, description: "Record deleted successfully", type: entity },
  { status: 400, description: "Bad request", type: ErrorResponse },
  { status: 404, description: "Record not found", type: ErrorResponse },
  { status: 500, description: "Internal server error", type: ErrorResponse }
];
