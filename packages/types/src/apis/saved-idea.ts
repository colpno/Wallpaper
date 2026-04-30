import type { PaginationPayload } from "./payload.js";
import type { SortableFields as SortablePinFields } from "./pin.js";
import type { FlattenObjectKeys } from "@/helpers.js";
import type { PinDB } from "@/models/pin.js";
import type { SavedIdea, SavedIdeaDB } from "@/models/saved-idea.js";
import type { UserDB } from "@/models/user.js";
import type { QueryFilter } from "@/query.js";

export type Fields = FlattenObjectKeys<SavedIdeaDB<UserDB, PinDB>>;
export type SortableFields = Extract<
  Fields,
  | "createdAt"
  | "updatedAt"
  | keyof {
      [K in SortablePinFields as `pin.${K}`]: unknown;
    }
>;
export type EmbeddableFields = Extract<Fields, "savedBy" | "pin">;

type EmbedData<TQuery> =
  TQuery extends Pick<QueryFilter<SavedIdeaDB, undefined, undefined, "savedBy">, "embed">
    ? SavedIdeaDB<UserDB>
    : TQuery extends Pick<QueryFilter<SavedIdeaDB, undefined, undefined, "pin">, "embed">
      ? SavedIdeaDB<string, PinDB>
      : TQuery extends {
            embed:
              | ["savedBy", "pin"]
              | ["pin", "savedBy"]
              | { path: ["savedBy", "pin"] | ["pin", "savedBy"] };
          }
        ? SavedIdeaDB<UserDB, PinDB>
        : SavedIdeaDB;

export type GetMany<
  TQuery extends QueryFilter<SavedIdeaDB, Fields, SortableFields, EmbeddableFields> = QueryFilter<
    SavedIdeaDB,
    Fields,
    SortableFields,
    EmbeddableFields
  >,
> = {
  query: TQuery;
  response: EmbedData<TQuery>[] | PaginationPayload<EmbedData<TQuery>[]>;
};

export type CheckSaved = {
  query: {
    userId: string;
    pinId: string;
  };
  response: { saved: boolean };
};

export type AddOne = {
  body: {
    pin: string;
  } & Pick<SavedIdea, "savedBy">;
  response: SavedIdeaDB;
};

export type DeleteOneById = {
  params: {
    id: string;
  };
  response: never;
};
