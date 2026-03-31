import type { DefaultTimestampProps } from "mongoose";

export type Environment = "production" | "development" | "test";

export type DefaultModelProps = {
  _id: string;
  __v: number;
} & Record<keyof DefaultTimestampProps, string>;

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};
