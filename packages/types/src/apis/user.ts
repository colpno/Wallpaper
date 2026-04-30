import type { FlattenObjectKeys } from "@/helpers.js";
import type { User, UserDB } from "@/models/user.js";
import type { QueryFilter } from "@/query.js";

export type Fields = FlattenObjectKeys<UserDB>;
export type SortableFields = Extract<
  Fields,
  "createdAt" | "updatedAt" | "firstName" | "lastName" | "username" | "email" | "birthdate"
>;

export type GetOne<
  TQuery extends Pick<
    QueryFilter<UserDB, Fields, SortableFields>,
    "firstName" | "lastName" | "username" | "email" | "birthdate" | "avatarUrl" | "select" | "embed"
  > = Pick<
    QueryFilter<UserDB, Fields, SortableFields>,
    "firstName" | "lastName" | "username" | "email" | "birthdate" | "avatarUrl" | "select" | "embed"
  >,
> = {
  query: TQuery;
  response: Pick<UserDB, "_id" | "username" | "email" | "avatarUrl" | "firstName" | "lastName">;
};

export type UpdateOneById = {
  params: {
    id: string;
  };
  body: Partial<
    Pick<User, "email" | "password" | "username"> & {
      avatar: File;
    }
  >;
  response: Pick<UserDB, "_id" | "username" | "email" | "avatarUrl" | "firstName" | "lastName">;
};

export type DeleteOneById = {
  params: {
    id: string;
  };
  response: never;
};
