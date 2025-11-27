import { exec } from "child_process";
import * as fs from "fs";
import { readFile } from "fs/promises";
import path from "path";
import * as yaml from "yaml";

import { Logger } from "@nestjs/common";
import { OpenAPIObject } from "@nestjs/swagger";
import { __root } from "./root";

function sortObject(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sortObject);

  if (obj && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortObject(obj[key]);
        return acc;
      }, {} as any);
  }

  return obj;
}

export async function generateApi(document: OpenAPIObject, force = false): Promise<void> {
  const logger = new Logger("API GENERATOR");

  const normalized = sortObject(document);
  const newYaml = yaml.stringify(normalized);

  let savedNormalized: any = null;

  try {
    const buffer = await readFile("./swagger.yaml");
    savedNormalized = sortObject(yaml.parse(buffer.toString()));
  } catch {
    logger.verbose("swagger.yaml not found, creating new one...");
  }

  if (savedNormalized && JSON.stringify(savedNormalized) === JSON.stringify(normalized) && !force) {
    return;
  }

  fs.writeFileSync("./swagger.yaml", newYaml);

  const targetDir = path.join(__root, "../../");
  const command = `cd "${targetDir}" && pnpm generate:api`;

  logger.verbose("Swagger.yaml updated, generating API...");

  exec(command, (error, _, stderr) => {
    if (error) {
      logger.error(error.message);
      return;
    }

    if (stderr) {
      logger.error(stderr);
    }

    logger.verbose("API generated.");
  });
}
