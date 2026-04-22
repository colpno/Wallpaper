import type { PaginationPayload } from "./payload.js";
import type { FlattenObjectKeys } from "@/helpers.js";
import type { Pin, PinDB } from "@/models/pin.js";
import type { UserDB } from "@/models/user.js";
import type { QueryFilter } from "@/query.js";

export type Fields = keyof PinDB | FlattenObjectKeys<PinDB<UserDB>>;
export type SortableFields = Extract<
  Fields,
  "createdAt" | "updatedAt" | "photoWidth" | "photoHeight" | "photoAspectRatio"
>;
export type EmbeddableFields = Extract<Fields, "pinOwner">;

export type GetMany = {
  query: QueryFilter<PinDB, Fields, SortableFields, EmbeddableFields>;
  response: PinDB[] | PaginationPayload<PinDB[]>;
};

export type GetOneById = {
  params: {
    id: string;
  };
  query: Pick<GetMany["query"], "select" | "embed">;
  response: PinDB;
};

export type AddOne = {
  body: Pick<Pin, "pinTitle" | "pinDescription" | "pinOwner" | "photoBlurHash"> & {
    photo: File;
  };
  response: PinDB;
};

export type UpdateOneById = {
  params: {
    id: string;
  };
  body: Partial<
    Pick<Pin, "pinTitle" | "pinDescription" | "photoBlurHash"> & {
      photo: File;
    }
  >;
  response: PinDB;
};

export type DeleteOneById = {
  params: {
    id: string;
  };
  response: never;
};

export type Search = {
  query: {
    /**
     * The smallest score amongst the last search results, used in pagination.
     * The largest is 1 which means the same item.
     */
    lastSmallestScore: number;
  } & Omit<GetMany["query"], "embed">;
  body: { text: string } | { embedding: number[] };
  /**
   * Descending sorted list by score by default.
   */
  response: {
    message?: string;
  } & PaginationPayload<
    Array<
      Omit<PinDB, "descriptionEmbeddings" | "photoCloudinaryId"> & {
        score: number;
      }
    >
  >;
};
