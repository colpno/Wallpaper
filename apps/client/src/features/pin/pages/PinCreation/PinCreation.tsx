import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { useStore } from "@/app/stores/useStore";

import { type PinCreationFormData } from "../../constants/schemas";
import { addPinMutationOptions } from "../../services/api/mutations";
import PhotoEditor from "./components/PhotoEditor";
import PinCreationForm from "./components/PinCreationForm";

function PinCreation() {
  const user = useStore((state) => state.auth.user);
  const { mutateAsync } = useMutation(addPinMutationOptions());
  const [file, setFile] = useState<File | null>(null);
  const [editFile, setEditFile] = useState<boolean>(false);

  const handleSubmit = async (formData: PinCreationFormData) => {
    if (!user) return;

    await mutateAsync({
      photo: formData.photo[0]!,
      pinOwner: user.id,
      pinTitle: formData.title,
      pinDescription: formData.description,
    });
  };

  const handleEditorSubmit = (file: File) => {
    setFile(file);
    setEditFile(false);
  };

  if (editFile && file) {
    return (
      <PhotoEditor file={file} onSubmit={handleEditorSubmit} onCancel={() => setEditFile(false)} />
    );
  }

  return (
    <PinCreationForm
      file={file}
      onFileSelect={setFile}
      onSubmit={handleSubmit}
      onEditPhotoClick={() => setEditFile(true)}
    />
  );
}

export default PinCreation;
