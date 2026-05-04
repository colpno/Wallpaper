import type { PinDB, UserDB } from "@repo/types";
import { cn } from "@repo/ui/lib";
import { useQuery } from "@tanstack/react-query";
import { LuDownload } from "react-icons/lu";

import { useStore } from "@/app/stores/useStore";
import SavePinButton from "@/components/common/SavePinButton";
import UserAvatar from "@/components/common/UserAvatar";
import Button from "@/components/ui/Button";
import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import Typography from "@/components/ui/Typography";
import { ROUTES } from "@/constants/common";
import { checkSavedQueryOptions } from "@/features/idea/services/api/queries";

import PinInfoDescription from "./PinInfoDescription";
import ZoomOutButton from "./ZoomOutButton";

function PinInfo(
  pin: Pick<
    PinDB<UserDB>,
    | "_id"
    | "pinTitle"
    | "pinDescription"
    | "pinOwner"
    | "photoUrl"
    | "photoWidth"
    | "photoHeight"
    | "photoAspectRatio"
  >
) {
  const user = useStore((state) => state.auth.user);
  const { data } = useQuery({
    ...checkSavedQueryOptions({ userId: user?.id || "", pinId: pin._id }),
    enabled: !!user?.id,
  });
  const isSaved = data?.saved;

  return (
    <div className="w-full overflow-clip rounded-b-2xl border-x border-b border-border">
      {/* Header */}
      <div className="sticky top-header-height right-0 left-0 z-pinpage-detail flex h-16 items-center justify-between border-t border-border bg-background px-4 py-2">
        <div>
          <Button variant="ghost" size="icon-lg">
            <LuDownload />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <Link
              to={ROUTES.PROFILE(user.username)}
              button
              variant="ghost"
              size="md"
              className="hover:underline"
            >
              Profile
            </Link>
          )}

          {pin.pinOwner._id !== user?.id && (
            <SavePinButton size="md" pinId={pin._id} pinPhoto={pin.photoUrl} saved={isSaved} />
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-3">
        {/* Image */}
        <div
          className="relative mx-auto max-h-[70dvh] max-w-full"
          style={{ aspectRatio: pin.photoAspectRatio }}
        >
          <Image
            src={pin.photoUrl}
            className={cn(
              "absolute size-full rounded-lg",
              pin.photoWidth > 620 && "rounded-xl",
              pin.photoWidth > 920 && "rounded-3xl"
            )}
          />

          <div
            className={cn(
              "mr-3 ml-auto flex h-full w-fit flex-col justify-end gap-3 pb-3",
              "[&>button]:sticky [&>button]:bg-white/60! [&>button]:text-black"
            )}
          >
            <ZoomOutButton pin={pin} className="bottom-3" saved={isSaved} />
          </div>
        </div>

        {/* Info */}
        <div className="mt-5 space-y-3">
          <Typography size="lg" className="leading-5 font-bold">
            {pin.pinTitle}
          </Typography>

          {!!pin.pinDescription && <PinInfoDescription>{pin.pinDescription}</PinInfoDescription>}

          <Link to={ROUTES.PROFILE(pin.pinOwner.username)} className="flex items-center gap-2">
            <UserAvatar
              src={pin.pinOwner.avatarUrl}
              alt={pin.pinOwner.username}
              className="size-6"
            />

            <Typography>
              {pin.pinOwner.firstName}
              {pin.pinOwner.lastName ? ` ${pin.pinOwner.lastName}` : ""}
            </Typography>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PinInfo;
