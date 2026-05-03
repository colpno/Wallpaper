import type { ImmerStateCreator } from "./useStore";
import type { PinCreationFormData } from "@/features/pin/constants/schemas";

import { addMonths } from "date-fns";

export type Draft = {
  expiredAt: Date;
  imageSrc: string;
  photo: File;
  originalPhoto: File;
  croppedArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
} & Omit<PinCreationFormData, "photo">;

export type DraftStoreState = {
  currentDraft: Draft | null;
  drafts: Draft[];
};

export type DraftStoreActions = {
  addDraft: (payload: Omit<Draft, "expiredAt" | "imageSrc" | "originalPhoto">) => void;
  /** Partial update. */
  updateDraft: (
    id: Draft["id"],
    payload: Partial<Omit<Draft, "id" | "expiredAt" | "imageSrc">>
  ) => void;
  removeDraft: (id: Draft["id"]) => void;
  setCurrentDraft: (payload: Draft | null) => void;
};

export type DraftStore = {
  draft: DraftStoreState & DraftStoreActions;
};

export const draftSlice: ImmerStateCreator<DraftStore> = (set) => ({
  draft: {
    currentDraft: null,
    drafts: [],

    addDraft: (payload) =>
      set((state) => {
        if (state.draft.drafts.some((d) => d.id === payload.id)) return;

        const id = payload.id;
        const expiredAt = addMonths(new Date(), 1);
        const imageSrc = URL.createObjectURL(payload.photo);
        const originalPhoto = payload.photo;

        const draft: Draft = { ...payload, id, expiredAt, imageSrc, originalPhoto };

        state.draft.currentDraft = draft;
        state.draft.drafts.push(draft);
      }),

    updateDraft: (id, payload) =>
      set((state) => {
        state.draft.drafts = state.draft.drafts.map((draft) => {
          if (draft.id === id) {
            const expiredAt = addMonths(new Date(), 1);

            const updated: Draft = {
              ...draft,
              ...payload,
              expiredAt,
            };

            // Update new image url if payload changed
            if (payload.photo) {
              URL.revokeObjectURL(draft.imageSrc);
              updated.imageSrc = URL.createObjectURL(payload.photo);
            }

            // Update fields affected by brand new photo if original photo changed
            if (payload.originalPhoto) {
              updated.croppedArea = undefined;
            }

            // Update current draft if occupying
            if (state.draft.currentDraft?.id === id) {
              state.draft.currentDraft = updated;
            }

            return updated;
          }

          return draft;
        });
      }),

    removeDraft: (id) =>
      set((state) => {
        // Unset current draft
        if (id === state.draft.currentDraft?.id) {
          URL.revokeObjectURL(state.draft.currentDraft.imageSrc);
          state.draft.currentDraft = null;
        }

        // Remove from draft list
        state.draft.drafts = state.draft.drafts.filter((draft) => {
          if (draft.id === id) {
            URL.revokeObjectURL(draft.imageSrc);
            return false;
          }
          return true;
        });
      }),

    setCurrentDraft: (payload) =>
      set((state) => {
        state.draft.currentDraft = payload;
      }),
  },
});
