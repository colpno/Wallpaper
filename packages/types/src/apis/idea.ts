import type { PaginationPayload } from "./payload.js";
import type { Fields as PinFields, SortableFields as SortablePinFields } from "./pin.js";
import type { Fields as UserFields, SortableFields as SortableUserFields } from "./user.js";
import type { FlattenObjectKeys } from "@/helpers.js";
import type { Idea, IdeaDB } from "@/models/idea.js";
import type { PinDB } from "@/models/pin.js";
import type { UserDB } from "@/models/user.js";
import type { QueryFilter } from "@/query.js";

export type Fields = FlattenObjectKeys<IdeaDB> | `pin.${PinFields}` | `savedBy.${UserFields}`;

export type SortableFields = Extract<
  Fields,
  "createdAt" | "updatedAt" | `pin.${SortablePinFields}` | `savedBy.${SortableUserFields}`
>;

export type EmbeddableFields = Extract<Fields, "savedBy" | "pin">;

type EmbedData<TQuery> =
  TQuery extends Pick<QueryFilter<IdeaDB, undefined, undefined, "savedBy">, "embed">
    ? IdeaDB<UserDB>
    : TQuery extends Pick<QueryFilter<IdeaDB, undefined, undefined, "pin">, "embed">
      ? IdeaDB<string, PinDB>
      : TQuery extends {
            embed:
              | ["savedBy", "pin"]
              | ["pin", "savedBy"]
              | { path: ["savedBy", "pin"] | ["pin", "savedBy"] };
          }
        ? IdeaDB<UserDB, PinDB>
        : IdeaDB;

export type GetMany<
  TQuery extends QueryFilter<IdeaDB, Fields, SortableFields, EmbeddableFields> = QueryFilter<
    IdeaDB,
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
  } & Pick<Idea, "savedBy">;
  response: IdeaDB;
};

export type DeleteOneById = {
  params: {
    id: string;
  };
  response: never;
};
