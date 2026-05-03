import type { UseFormReturn } from "react-hook-form";

import { cn } from "@repo/ui/lib";
import { type ChangeEvent } from "react";
import { FiArrowUpCircle } from "react-icons/fi";
import { LuPencil } from "react-icons/lu";

import TextareaField from "@/components/form/controls/TextareaField";
import TextField from "@/components/form/controls/TextField";
import Form from "@/components/form/Form";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Image from "@/components/ui/Image";
import Typography from "@/components/ui/Typography";
import { type PinCreationFormData, pinCreationSchema } from "@/features/pin/constants/schemas";
import { useObjectURL } from "@/hooks/useObjectURL";

type Props = {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onSubmit: (formData: PinCreationFormData) => void;
  onEditPhotoClick: () => void;
};

function PinCreationForm({ file, onFileSelect, onSubmit, onEditPhotoClick }: Props) {
  const imageSrc = useObjectURL(file);

  return (
    <Form onSubmit={onSubmit} schema={pinCreationSchema} showButtons={false}>
      {(methods) => (
        <FormContent
          {...methods}
          imageSrc={imageSrc}
          onFileSelect={onFileSelect}
          onEditPhotoClick={onEditPhotoClick}
        />
      )}
    </Form>
  );
}

type FormContentProps = {
  imageSrc: string | null;
  onFileSelect: (file: File | null) => void;
  onEditPhotoClick: () => void;
} & UseFormReturn<PinCreationFormData>;

function FormContent({ imageSrc, onFileSelect, onEditPhotoClick, ...methods }: FormContentProps) {
  const photoFieldProps = methods.register("photo");

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    photoFieldProps.onChange(e);
    onFileSelect(e.target.files?.[0] || null);
  };

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
          <Button type="submit" disabled={methods.formState.isSubmitting}>
            {methods.formState.isSubmitting ? "Publishing" : "Publish"}
          </Button>
        )}
      </div>

      <Container className="mt-8 flex max-w-6xl flex-col gap-13 lg:flex-row!">
        <div
          className={cn(
            "relative max-w-93.75 overflow-clip rounded-4xl",
            !imageSrc && "h-114.25 bg-secondary"
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
              "cursor-pointer opacity-0",
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

export default PinCreationForm;
