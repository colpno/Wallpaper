import { InferenceClient } from "@huggingface/inference";

import env from "@/configs/env.js";
import logger from "@/lib/logger.js";
import fileToBase64 from "@/utils/file-to-base64.js";
import { Error500 } from "@/utils/HttpError.js";

type File = Parameters<typeof fileToBase64>[0];

const client = new InferenceClient(env.HUGGING_FACE_TOKEN);

export const describeImage = async (file: File): Promise<string> => {
  const prompt = `Give me a single description sentence of this image including its visual characteristics, cultural symbolism, historical context, and semantic meaning, but without using any headings, bullet points, or section labels.`;
  const base64 = fileToBase64(file);

  const chatCompletion = await client.chatCompletion({
    model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct:sambanova",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: base64,
            },
          },
        ],
      },
    ],
  });

  if (!chatCompletion.choices[0]?.message.content) {
    logger.error(chatCompletion);
    throw new Error500("No description returned by model");
  }

  return chatCompletion.choices[0].message.content;
};

export const toEmbeddings = async (arg: File | string): Promise<number[]> => {
  const description = typeof arg === "string" ? arg : await describeImage(arg);

  const output = (await client.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    provider: "hf-inference",
    inputs: description,
  })) as number[];

  return output;
};
