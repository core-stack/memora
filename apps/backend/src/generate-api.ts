import { exec } from "child_process";
import * as fs from "fs";
import { readFile } from "fs/promises";
import path from "path";
import * as yaml from "yaml";

import { Logger } from "@nestjs/common";
import { OpenAPIObject } from "@nestjs/swagger";

import { __root } from "./root";

export async function generateApi(document: OpenAPIObject, force = false): Promise<void> {
  const buffer = await readFile("./swagger.yaml");
  const newYaml = yaml.stringify(document);
  const savedYaml = buffer.toString();
  if (savedYaml === newYaml && !force) return;

  const logger = new Logger("API GENERATOR");

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
