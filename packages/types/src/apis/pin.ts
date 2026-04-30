import type { PaginationPayload } from "./payload.js";
import type { FlattenObjectKeys } from "@/helpers.js";
import type { Pin, PinDB } from "@/models/pin.js";
import type { UserDB } from "@/models/user.js";
import type { QueryFilter } from "@/query.js";

export type Fields = FlattenObjectKeys<PinDB<UserDB>>;
export type SortableFields = Extract<
  Fields,
  "createdAt" | "updatedAt" | "photoWidth" | "photoHeight" | "photoAspectRatio"
>;
export type EmbeddableFields = Extract<Fields, "pinOwner">;

export type GetMany<
  TQuery extends QueryFilter<PinDB, Fields, SortableFields, EmbeddableFields> = QueryFilter<
    PinDB,
    Fields,
    SortableFields,
    EmbeddableFields
  >,
> = {
  query: TQuery;
  response:
    | (TQuery extends { embed: "pinOwner" } ? PinDB<UserDB> : PinDB)[]
    | PaginationPayload<(TQuery extends { embed: "pinOwner" } ? PinDB<UserDB> : PinDB)[]>;
};

export type GetManyWithSaves<
  TQuery extends Omit<QueryFilter<PinDB, Fields, SortableFields, EmbeddableFields>, "pinOwner"> =
    Omit<QueryFilter<PinDB, Fields, SortableFields, EmbeddableFields>, "pinOwner">,
> = {
  query: {
    pinOwner: string;
  } & TQuery;
  response:
    | (TQuery extends { embed: "pinOwner" } ? PinDB<UserDB> : PinDB)[]
    | PaginationPayload<(TQuery extends { embed: "pinOwner" } ? PinDB<UserDB> : PinDB)[]>;
};

export type GetOneById<
  TQuery extends Pick<GetMany["query"], "select" | "embed"> = Pick<
    GetMany["query"],
    "select" | "embed"
  >,
> = {
  params: {
    id: string;
  };
  query: TQuery;
  response: TQuery extends { embed: "pinOwner" } ? PinDB<UserDB> : PinDB;
};

export type AddOne = {
  body: Pick<Pin, "pinTitle" | "pinDescription" | "pinOwner"> & {
    photo: File;
  };
  response: PinDB;
};

export type UpdateOneById = {
  params: {
    id: string;
  };
  body: Partial<
    Pick<Pin, "pinTitle" | "pinDescription"> & {
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

export type Search<
  TQuery extends Omit<GetMany["query"], "embed"> = Omit<GetMany["query"], "embed">,
> = {
  query: {
    /**
     * The smallest score amongst the last search results, used in pagination.
     * The largest is 1 which means the same item.
     */
    lastSmallestScore: number;
  } & TQuery;
  body: { text: string } | { embedding: number[] };
  /**
   * Descending sorted list by score by default.
   */
  response: {
    message?: string;
  } & PaginationPayload<
    Array<
      Omit<
        TQuery extends { embed: "pinOwner" } ? PinDB<UserDB> : PinDB,
        "descriptionEmbeddings" | "photoCloudinaryId"
      > & {
        score: number;
      }
    >
  >;
};
