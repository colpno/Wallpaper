import { cn } from "@repo/ui/lib";
import { type ChangeEvent, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FiArrowUpCircle } from "react-icons/fi";
import { LuPencil } from "react-icons/lu";

import { useStore } from "@/app/stores/useStore";
import TextareaField from "@/components/form/controls/TextareaField";
import TextField from "@/components/form/controls/TextField";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Image from "@/components/ui/Image";
import Typography from "@/components/ui/Typography";
import { type PinCreationFormData } from "@/features/pin/constants/schemas";

type FormContentProps = {
  onEditPhotoClick: () => void;
};

function PinCreationFormContent({ onEditPhotoClick }: FormContentProps) {
  const addDraft = useStore((state) => state.draft.addDraft);
  const updateDraft = useStore((state) => state.draft.updateDraft);
  const currentDraft = useStore((state) => state.draft.currentDraft);
  const imageSrc = currentDraft?.imageSrc;
  const { register, watch, formState, setValue, getValues } = useFormContext<PinCreationFormData>();
  const photoFieldProps = register("photo");

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    photoFieldProps.onChange(e);

    if (!e.target.files?.[0]) return;

    const files = e.target.files;

    setValue("photo", files);
    addDraft({ id: getValues("id"), photo: files[0]! });
  };

  // Manipulate drafts
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const subscription = watch((values) => {
      const { id, photo, ...formData } = values;
      if (timeout) clearTimeout(timeout);
      if (!id || !photo?.[0]) return;

      const file = photo[0];

      timeout = setTimeout(() => {
        if (currentDraft && currentDraft.id === id) {
          updateDraft(id, { ...formData, photo: file, originalPhoto: file });
          return;
        }
      }, 200);
    });

    return () => {
      subscription.unsubscribe();

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [watch, currentDraft, updateDraft]);

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between border-y border-border px-4 py-3",
          !imageSrc && "py-6"
        )}
      >
        <Heading className="text-xl">Create Pin</Heading>

        {!!imageSrc && (
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? "Publishing" : "Publish"}
          </Button>
        )}
      </div>

      <Container className="mt-8 flex max-w-6xl flex-col gap-13 lg:flex-row!">
        <div
          className={cn(
            "relative w-93.75 overflow-clip rounded-4xl",
            (currentDraft === null || !imageSrc) && "h-114.25 bg-secondary"
          )}
        >
          {imageSrc ? (
            <>
              <Image src={imageSrc} alt="Pin Photo" className="size-full" />
              <Button
                variant="tertiary"
                className="absolute top-4 right-4 z-2 size-9 rounded-lg"
                onClick={onEditPhotoClick}
              >
                <LuPencil />
              </Button>
            </>
          ) : (
            <>
              <div className="pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4">
                <FiArrowUpCircle className="size-8" />

                <Typography className="text-center">
                  Choose a file or drag and drop it here
                </Typography>
              </div>

              <Typography
                size="sm"
                className="pointer-events-none absolute bottom-8 mx-6 text-center"
              >
                We recommend using high quality .jpg/.png/.webp files less than 5MB.
              </Typography>
            </>
          )}

          <input
            className={cn(
              "max-w-93.75 cursor-pointer opacity-0",
              imageSrc ? "absolute inset-0 size-full" : "size-full"
            )}
            {...photoFieldProps}
            onChange={handleFileSelect}
            type="file"
            accept="image/jpeg,image/png,image/webp"
          />
        </div>

        <div className="flex-1 space-y-6">
          <TextField
            name="id"
            hidden
            disabled
            slotProps={{
              fieldContainer: { className: cn("hidden!") },
            }}
          />

          <TextField
            name="title"
            label="Title"
            placeholder="Add a title"
            autoComplete="off"
            disabled={!imageSrc}
          />

          <TextareaField
            name="description"
            label="Description"
            placeholder="Add a detailed description"
            autoComplete="off"
            disabled={!imageSrc}
          />
        </div>
      </Container>
    </>
  );
}

export default PinCreationFormContent;
