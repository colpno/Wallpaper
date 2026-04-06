import type { PostAPIs, PostDB } from "@repo/types";
import { mutationOptions } from "@tanstack/react-query";

import { queryClient } from "@/lib/react-query/client";

import { addPost, removePostById, removePosts, undoPostsRemoval, updatePostById } from "./apis";
import { POST_KEYS } from "./keys";

export const addPostMutationOptions = () =>
  mutationOptions({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_KEYS.lists() });
    },
  });

export const updatePostByIdMutationOptions = () =>
  mutationOptions({
    mutationFn: (args: Pick<PostAPIs.UpdateOneById, "params" | "body">) =>
      updatePostById(args.params, args.body),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: POST_KEYS.lists() });
      queryClient.setQueriesData({ queryKey: POST_KEYS.item(vars.params) }, (old?: PostDB) =>
        old?._id === res._id ? res : old
      );
    },
  });

export const removePostByIdMutationOptions = () =>
  mutationOptions({
    mutationFn: (params: PostAPIs.RemoveOneById["params"]) => removePostById(params),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: POST_KEYS.lists() });
      queryClient.removeQueries({ queryKey: POST_KEYS.item(vars) });
    },
  });

export const removePostsMutationOptions = () =>
  mutationOptions({
    mutationFn: (body: PostAPIs.RemoveMany["body"]) => removePosts(body),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: POST_KEYS.lists() });
      vars.ids.forEach((id) => queryClient.removeQueries({ queryKey: POST_KEYS.item({ id }) }));
    },
  });

export const undoPostsRemovalMutationOptions = () =>
  mutationOptions({
    mutationFn: (body: PostAPIs.UndoRemoval["body"]) => undoPostsRemoval(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_KEYS.lists() });
    },
  });
