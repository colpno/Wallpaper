import { toast } from "@repo/ui/components";
import { useMutation } from "@tanstack/react-query";
import React, { type MouseEventHandler, useEffect } from "react";

import { useStore } from "@/app/stores/useStore";
import { ROUTES } from "@/constants/common";
import { addSavedIdeaMutationOptions } from "@/features/saved-idea/services/api/mutations";

import Button from "../ui/Button";
import Image from "../ui/Image";
import Link from "../ui/Link";
import Typography from "../ui/Typography";

type Props = {
  pinId: string;
  pinPhoto: string;
  onSuccess?: (success: boolean) => void;
  saved?: boolean;
} & React.ComponentProps<typeof Button>;

function SavePinButton({ pinId, pinPhoto, onSuccess, saved, ...props }: Props) {
  const user = useStore((state) => state.user);
  const { mutate, isPending, isSuccess } = useMutation(addSavedIdeaMutationOptions());

  if (!user) {
    throw new Error("Must be logged in to use this feature");
  }

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (user) {
      mutate({ savedBy: user.id, pin: pinId });
    }

    props.onClick?.(e);
  };

  useEffect(() => {
    onSuccess?.(isSuccess);

    if (isSuccess) {
      toast.success(
        <div className="flex items-center gap-2">
          <Image
            src={pinPhoto}
            alt="Saved pin photo"
            className="max-h-10 max-w-10 rounded-lg object-cover"
          />

          <div className="w-max">
            <Typography>Saved to</Typography>
            <Link to={ROUTES.PROFILE(user.username)} className="mt-auto font-bold">
              Profile
            </Link>
          </div>

          <Button size="sm">Undo</Button>
        </div>,
        { style: { width: "fit-content" } }
      );
    }
  }, [isSuccess]);

  return (
    <Button
      size="sm"
      variant={saved || isPending || isSuccess ? "active" : "default"}
      {...props}
      onClick={handleClick}
    >
      {isPending ? "Saving..." : saved || isSuccess ? "Saved" : "Save"}
    </Button>
  );
}

export default SavePinButton;
