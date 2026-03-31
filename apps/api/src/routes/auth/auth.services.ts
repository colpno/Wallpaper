import { createHash, randomBytes } from "crypto";

export const generateSalt = (length: number = 16) => {
  return randomBytes(length).toString("hex");
};

export const hash = (
  plainText: string,
  salt: string = generateSalt(),
  algorithm: string = "sha256"
) => {
  const hash = createHash(algorithm);
  hash.update(plainText + salt);
  const hashedValue = hash.digest("hex");
  return { salt, hashedValue };
};
