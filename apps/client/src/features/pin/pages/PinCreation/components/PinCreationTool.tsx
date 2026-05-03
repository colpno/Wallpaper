import { cn } from "@repo/ui/lib";
import { useState } from "react";

import { useStore } from "@/app/stores/useStore";
import Form from "@/components/form/Form";
import { type PinCreationFormData, pinCreationSchema } from "@/features/pin/constants/schemas";

import DraftPanel from "./DraftPanel";
import PinCreationFormContent from "./PinCreationFormContent";

type Props = {
  onSubmit: (formData: PinCreationFormData) => void;
  onEditPhotoClick: () => void;
};

function PinCreationTool({ onSubmit, onEditPhotoClick }: Props) {
  const [sidebar, setSidebar] = useState<"drafts" | null>(null);
  const currentDraft = useStore((state) => state.draft.currentDraft);
  const setCurrentDraft = useStore((state) => state.draft.setCurrentDraft);
  const id = currentDraft?.id || Math.random().toString(36).substring(2);
  const defaultValues: Partial<PinCreationFormData> = { id, title: "", description: "" };

  return (
    <Form
      onSubmit={onSubmit}
      schema={pinCreationSchema}
      showButtons={false}
      defaultValues={defaultValues}
      className="relative grid flex-1 grid-cols-[1fr_auto] transition-[padding-right] duration-not-sidebar ease-out"
    >
      {({ reset }) => (
        <>
          <div className={cn(!!sidebar && "pr-pin-creation-sub-sidebar")}>
            <PinCreationFormContent onEditPhotoClick={onEditPhotoClick} />
          </div>

          <DraftPanel
            sidebar={sidebar}
            setSidebar={setSidebar}
            onCreateNew={() => {
              reset({ ...defaultValues, id: Math.random().toString(36).substring(2) });
              setCurrentDraft(null);
            }}
          />
        </>
      )}
    </Form>
  );
}

export default PinCreationTool;
