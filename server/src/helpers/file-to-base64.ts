/**
 * Convert Multer file to Base64 string.
 * @param file Multer file object.
 * @returns Base64 string.
 */

export default function fileToBase64(
  file: Pick<Express.Multer.File, "buffer" | "mimetype">
): string {
  const b64 = Buffer.from(file.buffer).toString("base64");

  return "data:" + file.mimetype + ";base64," + b64;
}
