/**
 * Converts an image URL to a Blob URL.
 * @param url - The URL to convert to a Blob.
 * @returns A Promise that resolves to a Blob URL.
 */

export default async function urlToBlobUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    throw error;
  }
}
