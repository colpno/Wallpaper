import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { useStore } from "@/app/stores/useStore";

import { type PinCreationFormData } from "../../constants/schemas";
import { addPinMutationOptions } from "../../services/api/mutations";
import PhotoEditor from "./components/PhotoEditor";
import PinCreationTool from "./components/PinCreationTool";

export type Sidebar = "drafts" | null;

function PinCreation() {
  const user = useStore((state) => state.auth.user);
  const { mutateAsync } = useMutation(addPinMutationOptions());
  const [editFile, setEditFile] = useState<boolean>(false);
  const currentDraft = useStore((state) => state.draft.currentDraft);

  const handleSubmit = async (formData: PinCreationFormData) => {
    if (!user) return;

    await mutateAsync({
      photo: formData.photo[0]!,
      pinOwner: user.id,
      pinTitle: formData.title,
      pinDescription: formData.description,
    });
  };

  if (editFile && currentDraft) {
    return (
      <PhotoEditor
        draft={currentDraft}
        onDone={() => setEditFile(false)}
        onCancel={() => setEditFile(false)}
      />
    );
  }

  return <PinCreationTool onSubmit={handleSubmit} onEditPhotoClick={() => setEditFile(true)} />;
}

export default PinCreation;
