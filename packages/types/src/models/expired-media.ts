import type { DefaultModelProps } from "@/common.js";

export type ExpiredMedia = {
  publicId: string;
};

export type ExpiredMediaDB = ExpiredMedia & DefaultModelProps;
