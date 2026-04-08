import type { PinAPIs, PinDB } from "@repo/types";
import { mutationOptions } from "@tanstack/react-query";

import { queryClient } from "@/lib/react-query/client";

import { addPin, removePinById, removePins, undoPinsRemoval, updatePinById } from "./apis";
import { PIN_KEYS } from "./keys";

export const addPinMutationOptions = () =>
  mutationOptions({
    mutationFn: addPin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PIN_KEYS.lists() });
    },
  });

export const updatePinByIdMutationOptions = () =>
  mutationOptions({
    mutationFn: (args: Pick<PinAPIs.UpdateOneById, "params" | "body">) =>
      updatePinById(args.params, args.body),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: PIN_KEYS.lists() });
      queryClient.setQueriesData({ queryKey: PIN_KEYS.item(vars.params) }, (old?: PinDB) =>
        old?._id === res._id ? res : old
      );
    },
  });

export const removePinByIdMutationOptions = () =>
  mutationOptions({
    mutationFn: (params: PinAPIs.RemoveOneById["params"]) => removePinById(params),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: PIN_KEYS.lists() });
      queryClient.removeQueries({ queryKey: PIN_KEYS.item(vars) });
    },
  });

export const removePinsMutationOptions = () =>
  mutationOptions({
    mutationFn: (body: PinAPIs.RemoveMany["body"]) => removePins(body),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: PIN_KEYS.lists() });
      vars.ids.forEach((id) => queryClient.removeQueries({ queryKey: PIN_KEYS.item({ id }) }));
    },
  });

export const undoPinsRemovalMutationOptions = () =>
  mutationOptions({
    mutationFn: (body: PinAPIs.UndoRemoval["body"]) => undoPinsRemoval(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PIN_KEYS.lists() });
    },
  });
