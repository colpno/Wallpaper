import { createHash } from "crypto";

export function hash(key: string, text: string): string {
  return createHash("sha256")
    .update(key + text)
    .digest("hex");
}
