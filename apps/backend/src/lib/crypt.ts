import * as argon2 from "argon2";
import * as crypto from "crypto";

import { env } from "@/env";
import { SecretRecord } from "@/infra/security/types";

function randBytes(n: number): Buffer {
  return crypto.randomBytes(n);
}

async function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
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

function aesGcmEncrypt(key: Buffer, plaintext: string) {
  const iv = randBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  return { ciphertext, iv, tag };
}

function aesGcmDecrypt(key: Buffer, iv: Buffer, tag: Buffer, ciphertext: Buffer) {
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([ decipher.update(ciphertext), decipher.final() ]);
  return plaintext.toString("utf8");
}

export async function encrypt(secret: string, masterPassword: string = env.ENCRYPT_MASTER_PASSWORD): Promise<SecretRecord> {
  // 1) generate data key
  const dataKey = randBytes(32);

  // 2) encrypt secret with dataKey
  const encSecret = aesGcmEncrypt(dataKey, secret);

  // 3) derive master key
  const salt = randBytes(16);
  const masterKey = await deriveKey(masterPassword, salt);

  // 4) encrypt dataKey with master key
  const encDataKey = aesGcmEncrypt(masterKey, dataKey.toString("base64"));

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

export async function decrypt(record: SecretRecord, masterPassword: string = env.ENCRYPT_MASTER_PASSWORD): Promise<string> {
  const salt = Buffer.from(record.salt, "base64");
  const masterKey = await deriveKey(masterPassword, salt);

  // 1) decrypt dataKey
  const dataKeyBase64 = aesGcmDecrypt(
    masterKey,
    Buffer.from(record.iv_data_key, "base64"),
    Buffer.from(record.tag_data_key, "base64"),
    Buffer.from(record.encrypted_data_key, "base64")
  );
  const dataKey = Buffer.from(dataKeyBase64, "base64");

  // 2) decrypt secret
  const secret = aesGcmDecrypt(
    dataKey,
    Buffer.from(record.iv_secret, "base64"),
    Buffer.from(record.tag_secret, "base64"),
    Buffer.from(record.ciphertext, "base64")
  );

  return secret;
}
