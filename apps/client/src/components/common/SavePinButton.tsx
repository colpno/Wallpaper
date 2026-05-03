import { toast } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";
import { useMutation } from "@tanstack/react-query";
import React, { type MouseEventHandler, useEffect, useState } from "react";

import { useStore } from "@/app/stores/useStore";
import { ROUTES } from "@/constants/common";
import { addIdeaMutationOptions } from "@/features/idea/services/api/mutations";

import Button from "../ui/Button";
import Image from "../ui/Image";
import Link from "../ui/Link";
import Typography from "../ui/Typography";
import LoginDialogForm from "./LoginDialogForm";

type Props = {
  pinId: string;
  pinPhoto: string;
  saved?: boolean;
} & React.ComponentProps<typeof Button>;

function SavePinButton({ pinId, pinPhoto, saved, ...props }: Props) {
  const [openLoginForm, setOpenLoginForm] = useState(false);
  const user = useStore((state) => state.auth.user);
  const { mutate, isPending, isSuccess } = useMutation(addIdeaMutationOptions());

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (user) {
      mutate({ savedBy: user.id, pin: pinId });
    } else {
      setOpenLoginForm(true);
    }

    props.onClick?.(e);
  };

  useEffect(() => {
    if (isSuccess && user) {
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
    <>
      <Button
        size="sm"
        variant={saved || isPending || isSuccess ? "active" : "default"}
        {...props}
        onClick={handleClick}
        className={cn(saved && "pointer-events-none")}
      >
        {isPending ? "Saving..." : saved || isSuccess ? "Saved" : "Save"}
      </Button>

      <LoginDialogForm open={openLoginForm} onOpenChange={setOpenLoginForm} />
    </>
  );
}

export default SavePinButton;
