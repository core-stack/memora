import { applyDecorators, Delete, Get, Post, Put } from "@nestjs/common";
import { ResponseConfig } from "../types";
import { ApiResponse } from "@nestjs/swagger";

export const ApiResponses = (responseConfigs: ResponseConfig[] = []) => {
  return applyDecorators(...responseConfigs.map(config => ApiResponse(config)));
};

export const Http = (
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  ignore?: boolean
) => {
  if (ignore) return applyDecorators();
  switch (method) {
    case "GET":
      return Get(path);
    case "POST":
      return Post(path);
    case "PUT":
      return Put(path);
    case "PATCH":
      return Put(path);
    case "DELETE":
      return Delete(path);
  }
};

type HttpOptions = {
  ignore?: boolean;
  responses?: ResponseConfig[];
}

export const HttpGet = (path?: string, opts?: HttpOptions) => applyDecorators(
  Http("GET", path ?? "", opts?.ignore),
  ApiResponses(opts?.responses ?? [])
);
export const HttpPost = (path?: string, opts?: HttpOptions) => applyDecorators(
  Http("POST", path ?? "", opts?.ignore),
  ApiResponses(opts?.responses ?? [])
);
export const HttpPut = (path?: string, opts?: HttpOptions) => applyDecorators(
  Http("PUT", path ?? "", opts?.ignore),
  ApiResponses(opts?.responses ?? [])
);
export const HttpPatch = (path?: string, opts?: HttpOptions) => applyDecorators(
  Http("PATCH", path ?? "", opts?.ignore),
  ApiResponses(opts?.responses ?? [])
);
export const HttpDelete = (path?: string, opts?: HttpOptions) => applyDecorators(
  Http("DELETE", path ?? "", opts?.ignore),
  ApiResponses(opts?.responses ?? [])
);
