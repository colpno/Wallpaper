import { cn } from "@repo/ui/lib";
import { type ChangeEvent, useState } from "react";
import { FiArrowUpCircle } from "react-icons/fi";

import TextareaField from "@/components/form/controls/TextareaField";
import TextField from "@/components/form/controls/TextField";
import Form from "@/components/form/Form";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Image from "@/components/ui/Image";
import Typography from "@/components/ui/Typography";
import { type PinCreationFormData, pinCreationSchema } from "@/features/pin/constants/schemas";

type Props = {
  onSubmit: (formData: PinCreationFormData) => void;
};

function PinCreationForm({ onSubmit }: Props) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <Form onSubmit={onSubmit} schema={pinCreationSchema} showButtons={false}>
      {(methods) => {
        const photoFieldProps = methods.register("photo");

        const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
          photoFieldProps.onChange(e);
          setFile(e.target.files?.[0] || null);
        };

        return (
          <>
            <div
              className={cn(
                "flex items-center justify-between border-y border-gray-300 p-3",
                !file && "py-6"
              )}
            >
              <Heading className="text-xl">Create Pin</Heading>

              {file && (
                <Button type="submit" disabled={methods.formState.isSubmitting}>
                  {methods.formState.isSubmitting ? "Publishing" : "Publish"}
                </Button>
              )}
            </div>

            <Container className="mt-8 flex max-w-6xl flex-col gap-13 lg:flex-row!">
              <div className="relative w-93.75 space-y-6 self-center">
                <div className={cn("relative h-114.25 rounded-4xl bg-secondary", file && "hidden")}>
                  <input
                    className="size-full cursor-pointer opacity-0"
                    {...photoFieldProps}
                    onChange={handleFileSelect}
                    type="file"
                  />

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
                    We recommend using high quality .jpg files less than 5MB.
                  </Typography>
                </div>

                {file && (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Pin Photo"
                    className="absolute inset-0 rounded-4xl"
                  />
                )}
              </div>

              <div className="flex-1 space-y-6">
                <TextField
                  name="title"
                  label="Title"
                  placeholder="Add a title"
                  autoComplete="off"
                  disabled={!file}
                />

                <TextareaField
                  name="description"
                  label="Description"
                  placeholder="Add a detailed description"
                  autoComplete="off"
                  disabled={!file}
                />
              </div>
            </Container>
          </>
        );
      }}
    </Form>
  );
}

export default PinCreationForm;
