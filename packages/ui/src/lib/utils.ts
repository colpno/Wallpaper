import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names into a single string.
 * @param inputs - Plain or conditional class names to merge.
 * @returns A merged string of class names (resolves tailwind class conflicts).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
