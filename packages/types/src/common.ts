import type { DefaultTimestampProps } from "mongoose";

export type Environment = "production" | "development" | "test";

export type DefaultModelProps = {
  _id: string;
  __v: number;
} & Record<keyof DefaultTimestampProps, string>;
