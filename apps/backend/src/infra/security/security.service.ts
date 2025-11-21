import * as argon2 from "argon2";
import * as crypto from "crypto";
import bcrypt from "bcrypt";

import { Injectable } from "@nestjs/common";

import { SecretRecord } from "./types";

@Injectable()
export class SecurityService {
  private randBytes(n: number): Buffer {
    return crypto.randomBytes(n);
  }

  private async deriveKey(password: string, salt: Buffer): Promise<Buffer> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      salt,
      raw: true,
      timeCost: 3,
      memoryCost: 64 * 1024,
      parallelism: 4,
      hashLength: 32
    }) as unknown as Buffer;
  }

  private aesGcmEncrypt(key: Buffer, plaintext: string) {
    const iv = this.randBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const ciphertext = Buffer.concat([
      cipher.update(plaintext, "utf8"),
      cipher.final()
    ]);
    const tag = cipher.getAuthTag();
    return { ciphertext, iv, tag };
  }

  private aesGcmDecrypt(key: Buffer, iv: Buffer, tag: Buffer, ciphertext: Buffer) {
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([ decipher.update(ciphertext), decipher.final() ]);
    return plaintext.toString("utf8");
  }

  async encrypt(secret: string, masterPassword: string): Promise<SecretRecord> {
    // 1) generate data key
    const dataKey = this.randBytes(32);

    // 2) encrypt secret with dataKey
    const encSecret = this.aesGcmEncrypt(dataKey, secret);

    // 3) derive master key
    const salt = this.randBytes(16);
    const masterKey = await this.deriveKey(masterPassword, salt);

    // 4) encrypt dataKey with master key
    const encDataKey = this.aesGcmEncrypt(masterKey, dataKey.toString("base64"));

    // 5) return record (base64)
    return {
      ciphertext: encSecret.ciphertext.toString("base64"),
      iv_secret: encSecret.iv.toString("base64"),
      tag_secret: encSecret.tag.toString("base64"),
      encrypted_data_key: encDataKey.ciphertext.toString("base64"),
      iv_data_key: encDataKey.iv.toString("base64"),
      tag_data_key: encDataKey.tag.toString("base64"),
      salt: salt.toString("base64")
    };
  }

  async decrypt(record: SecretRecord, masterPassword: string): Promise<string> {
    const salt = Buffer.from(record.salt, "base64");
    const masterKey = await this.deriveKey(masterPassword, salt);

    // 1) decrypt dataKey
    const dataKeyBase64 = this.aesGcmDecrypt(
      masterKey,
      Buffer.from(record.iv_data_key, "base64"),
      Buffer.from(record.tag_data_key, "base64"),
      Buffer.from(record.encrypted_data_key, "base64")
    );
    const dataKey = Buffer.from(dataKeyBase64, "base64");

    // 2) decrypt secret
    const secret = this.aesGcmDecrypt(
      dataKey,
      Buffer.from(record.iv_secret, "base64"),
      Buffer.from(record.tag_secret, "base64"),
      Buffer.from(record.ciphertext, "base64")
    );

    return secret;
  }

  hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
