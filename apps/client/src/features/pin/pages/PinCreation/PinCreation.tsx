import { useMutation } from "@tanstack/react-query";

import { useStore } from "@/app/stores/useStore";

import { type PinCreationFormData } from "../../constants/schemas";
import { addPinMutationOptions } from "../../services/api/mutations";
import PinCreationForm from "./components/PinCreationForm";

function PinCreation() {
  const user = useStore((state) => state.user);
  const { mutateAsync } = useMutation(addPinMutationOptions());

  const handleSubmit = async (formData: PinCreationFormData) => {
    if (!user) return;

    await mutateAsync({
      photo: formData.photo[0]!,
      pinOwner: user.id,
      pinTitle: formData.title,
      pinDescription: formData.description,
    });
  };

  return <PinCreationForm onSubmit={handleSubmit} />;
}

export default PinCreation;
