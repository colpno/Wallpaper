import type { Sidebar } from "../PinCreation";
import type { Draft } from "@/app/stores/useDraftStore";
import type { PinCreationFormData } from "@/features/pin/constants/schemas";

import { cn } from "@repo/ui/lib";
import { formatDistanceToNow } from "date-fns";
import { type Dispatch, type SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { BsChevronDoubleLeft, BsChevronDoubleRight, BsThreeDots } from "react-icons/bs";

import { useStore } from "@/app/stores/useStore";
import DropdownMenu from "@/components/common/DropdownMenu";
import Button from "@/components/ui/Button";
import Image from "@/components/ui/Image";
import Typography from "@/components/ui/Typography";

type Props = {
  sidebar: Sidebar;
  setSidebar: Dispatch<SetStateAction<Sidebar>>;
  onCreateNew: () => void;
};

function DraftPanel({ setSidebar, sidebar, onCreateNew }: Props) {
  const drafts = useStore((state) => state.draft.drafts);
  const currentDraft = useStore((state) => state.draft.currentDraft);

  return (
    <>
      <div
        className={cn(
          "fixed top-header-height right-0 bottom-0 w-pin-creation-sub-sidebar border border-border bg-background transition-[translate] duration-sidebar ease-in",
          sidebar === "drafts" ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="mb-4 space-y-4 border-b border-border p-4">
          <div className="flex items-center justify-between">
            <Typography className="text-xl font-bold">Pin Drafts ({drafts.length})</Typography>
            <Button variant="ghost" size="icon-lg" onClick={() => setSidebar(null)}>
              <BsChevronDoubleRight className="size-7!" />
            </Button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            disabled={!currentDraft}
            onClick={onCreateNew}
          >
            Create new
          </Button>
        </div>

        {drafts.length > 0 && (
          <div className="space-y-2 px-2">
            {drafts.map((draft) => (
              <DraftItem draft={draft} key={draft.id} />
            ))}
          </div>
        )}
      </div>

      {!sidebar && (
        <div className="border border-border">
          <div className="space-y-4 border-b border-border p-4">
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={() => setSidebar((prev) => (prev === null ? "drafts" : null))}
            >
              <BsChevronDoubleLeft />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

type DraftItemProps = {
  draft: Draft;
};

function DraftItem({ draft }: DraftItemProps) {
  if (!draft.photo) throw new Error("DraftItem must have a photo");

  const currentDraft = useStore((state) => state.draft.currentDraft);
  const setCurrentDraft = useStore((state) => state.draft.setCurrentDraft);
  const removeDraft = useStore((state) => state.draft.removeDraft);
  const addDraft = useStore((state) => state.draft.addDraft);
  const { reset } = useFormContext<PinCreationFormData>();

  const handleDuplicateDraft = (): void => {
    addDraft({
      ...draft,
      id: Math.random().toString(36).substring(2),
    });
  };

  const handleItemClick = () => {
    const { photo: _, ...rest } = draft;

    setCurrentDraft(draft);
    reset(rest);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg p-2 hover:bg-secondary",
        currentDraft?.id === draft.id && "border border-black bg-secondary"
      )}
    >
      <div
        role="button"
        onClick={handleItemClick}
        className="flex cursor-pointer items-center gap-2"
      >
        <Image src={draft.imageSrc} alt="Draft photo" className="size-18 rounded-lg object-cover" />

        <Typography className="flex-1">
          {formatDistanceToNow(draft.expiredAt)} until expiration
        </Typography>
      </div>

      <DropdownMenu
        data={[
          { key: "duplicate", label: "Duplicate", onClick: handleDuplicateDraft },
          { key: "delete", label: "Delete", onClick: () => removeDraft(draft.id) },
        ]}
        slotProps={{ trigger: { asChild: true } }}
        trigger={
          <Button variant="ghost" size="icon-sm">
            <BsThreeDots />
          </Button>
        }
      />
    </div>
  );
}

export default DraftPanel;
