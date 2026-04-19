import type { PaginationPayload } from "./payload.js";
import type { SortableFields as SortablePinFields } from "./pin.js";
import type { FlattenObjectKeys } from "@/helpers.js";
import type { PinDB } from "@/models/pin.js";
import type { SavedIdea, SavedIdeaDB } from "@/models/saved-idea.js";
import type { UserDB } from "@/models/user.js";
import type { QueryFilter } from "@/query.js";

export type Fields = keyof SavedIdeaDB | FlattenObjectKeys<SavedIdeaDB<UserDB, PinDB>>;
export type SortableFields = Extract<
  Fields,
  | "createdAt"
  | "updatedAt"
  | keyof {
      [K in SortablePinFields as `pin.${K}`]: unknown;
    }
>;
export type EmbeddableFields = Extract<Fields, "savedBy" | "pin">;

export type GetMany = {
  query: QueryFilter<SavedIdeaDB, Fields, SortableFields, EmbeddableFields>;
  response: SavedIdeaDB[] | PaginationPayload<SavedIdeaDB[]>;
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
