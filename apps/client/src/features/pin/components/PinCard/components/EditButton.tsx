import { DialogClose } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";
import { useMutation } from "@tanstack/react-query";
import { LuPencil } from "react-icons/lu";

import { useStore } from "@/app/stores/useStore";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import Dialog from "@/components/dialogs/Dialog";
import Button from "@/components/ui/Button";
import Image from "@/components/ui/Image";
import Typography from "@/components/ui/Typography";
import { deleteIdeaByIdMutationOptions } from "@/features/idea/services/api/mutations";
import { deletePinByIdMutationOptions } from "@/features/pin/services/api/mutations";

type Props = {
  pinId: string;
  pinOwnerId: string;
  pinPhoto: string;
} & React.ComponentProps<typeof Button>;

function EditButton({ pinId, pinOwnerId, pinPhoto, ...props }: Props) {
  const { mutate: deleteIdea } = useMutation(deleteIdeaByIdMutationOptions());
  const { mutate: deletePin } = useMutation(deletePinByIdMutationOptions());
  const user = useStore((state) => state.user);
  const isPinOwner = pinOwnerId === user?.id;

  const handleDelete = (confirm: boolean) => {
    if (!user) return;

    if (confirm) {
      if (isPinOwner) {
        deletePin({ id: pinId });
      } else {
        deleteIdea({ id: pinId });
      }
    }
  };

  return (
    <Dialog
      title="Edit this Pin"
      showCloseButton={false}
      slotProps={{
        trigger: { asChild: true },
        title: { className: cn("text-center text-2xl") },
      }}
      trigger={
        <Button variant="tertiary" size="icon-sm" {...props}>
          <LuPencil />
        </Button>
      }
      footer={
        <>
          <DialogClose asChild>
            <Button variant="secondary" size="sm">
              Cancel
            </Button>
          </DialogClose>

          <ConfirmationDialog
            title="Are you sure?"
            onConfirm={handleDelete}
            slotProps={{
              trigger: { asChild: true },
              confirmButton: { children: "Delete" },
            }}
            trigger={<Button size="sm">Delete</Button>}
          >
            <Typography className="text-center">
              Once you delete a Pin, you can&apos;t undo it!
            </Typography>
          </ConfirmationDialog>
        </>
      }
    >
      <Image src={pinPhoto} alt="Pin photo" className="mx-auto w-59 rounded-2xl" />
    </Dialog>
  );
}

export default EditButton;
