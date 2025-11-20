import { pipeline } from "@xenova/transformers";
import { Ollama } from "ollama";

import { fileToBase64 } from "@/helpers";

type File = Parameters<typeof fileToBase64>[0];

const ollama = new Ollama();
const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

export const describeImage = async (file: File): Promise<string> => {
  const prompt = `Give me a single description of this image including its visual characteristics, cultural symbolism, historical context, and semantic meaning.`;
  const imageBase64 = fileToBase64(file);
  const output = await ollama.generate({
    model: "llama3.1",
    prompt,
    images: [imageBase64],
  });
  return output.response;
};

export async function toEmbeddings(description: string): Promise<number[]>;
export async function toEmbeddings(file: File): Promise<number[]>;
export async function toEmbeddings(arg: File | string): Promise<number[]> {
  const description = typeof arg === "string" ? arg : await describeImage(arg);
  const response = await extractor(description, { pooling: "mean", normalize: true });
  return Array.from(response.data);
}
