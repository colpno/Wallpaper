import type { PinAPIs, PinDB } from "@repo/types";
import { mutationOptions } from "@tanstack/react-query";

import { queryClient } from "@/lib/react-query/client";

import { addPin, deletePinById, updatePinById } from "./apis";
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

export const deletePinByIdMutationOptions = () =>
  mutationOptions({
    mutationFn: (params: PinAPIs.DeleteOneById["params"]) => deletePinById(params),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: PIN_KEYS.lists() });
      queryClient.removeQueries({ queryKey: PIN_KEYS.item(vars) });
    },
  });
