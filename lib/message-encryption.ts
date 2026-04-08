import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

const ENCRYPTED_MESSAGE_PREFIX = "enc:v1";
const MESSAGE_ENCRYPTION_KEY_ENV = "MESSAGE_ENCRYPTION_KEY";

let cachedKey: Buffer | null = null;

const getEncryptionKey = () => {
  if (cachedKey) {
    return cachedKey;
  }

  const encodedKey = process.env[MESSAGE_ENCRYPTION_KEY_ENV];

  if (!encodedKey) {
    throw new Error(
      `Missing required environment variable: ${MESSAGE_ENCRYPTION_KEY_ENV}`,
    );
  }

  const key = Buffer.from(encodedKey, "base64");

  if (key.length !== 32) {
    throw new Error(
      `${MESSAGE_ENCRYPTION_KEY_ENV} must be a base64-encoded 32-byte key`,
    );
  }

  cachedKey = key;
  return key;
};

export const encryptMessageBody = (value: string) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    ENCRYPTED_MESSAGE_PREFIX,
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
};

export const decryptMessageBody = (value: string) => {
  if (!value.startsWith(`${ENCRYPTED_MESSAGE_PREFIX}:`)) {
    return value;
  }

  const [, , ivBase64, authTagBase64, encryptedBase64] = value.split(":");

  if (!ivBase64 || !authTagBase64 || !encryptedBase64) {
    throw new Error("Stored message payload is malformed");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(ivBase64, "base64"),
  );
  decipher.setAuthTag(Buffer.from(authTagBase64, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};
