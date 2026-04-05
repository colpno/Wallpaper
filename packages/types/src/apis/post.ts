import type { PaginationPayload } from "./payload.js";
import type { FlattenObjectKeys } from "@/helpers.js";
import type { Post, PostDB } from "@/models/post.js";
import type { UserDB } from "@/models/user.js";
import type { QueryFilter } from "@/query.js";

export type Fields = keyof PostDB | FlattenObjectKeys<PostDB<UserDB>>;
export type SortableFields = Extract<
  Fields,
  "createdAt" | "updatedAt" | "removedAt" | "photoWidth" | "photoHeight" | "photoAspectRatio"
>;
export type EmbeddableFields = Extract<Fields, "postOwner">;

export type GetMany = {
  query: QueryFilter<PostDB, Fields, SortableFields, EmbeddableFields>;
  response: PostDB[] | PaginationPayload<PostDB[]>;
};

export type GetOneById = {
  params: {
    id: string;
  };
  query: Pick<GetMany["query"], "select" | "embed">;
  response: PostDB;
};

export type AddOne = {
  body: Pick<Post, "postTitle" | "postDescription" | "postOwner" | "photoBlurHash"> & {
    photo: File;
  };
  response: PostDB;
};

export type UpdateOneById = {
  params: {
    id: string;
  };
  body: Partial<
    Pick<Post, "postTitle" | "postDescription" | "photoBlurHash"> & {
      photo: File;
    }
  >;
  response: PostDB;
};

export type RemoveOneById = {
  params: {
    id: string;
  };
  response: never;
};

export type RemoveMany = {
  body: {
    ids: string[];
  };
  response: never;
};

export type UndoRemoval = {
  body: {
    ids: string[];
  };
  response: never;
};

export type Search = {
  query: GetMany["query"];
  body: { text: string } | { image: File };
  response: PaginationPayload<
    Array<
      Omit<PostDB, "descriptionEmbeddings" | "photoCloudinaryId"> & {
        score: number;
      }
    >
  >;
};
