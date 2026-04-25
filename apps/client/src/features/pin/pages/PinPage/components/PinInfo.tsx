import type { PinDB } from "@repo/types";
import { cn } from "@repo/ui/lib";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LuDownload } from "react-icons/lu";

import { useStore } from "@/app/stores/useStore";
import SavePinButton from "@/components/common/SavePinButton";
import Button from "@/components/ui/Button";
import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import { ROUTES } from "@/constants/common";
import { checkSavedQueryOptions } from "@/features/saved-idea/services/api/queries";

import ZoomOutButton from "./ZoomOutButton";

function PinInfo(pin: Pick<PinDB, "_id" | "photoUrl" | "photoWidth" | "photoAspectRatio">) {
  const user = useStore((state) => state.user);
  const [isSavePinSuccess, setIsSavePinSuccess] = useState(false);
  const { data } = useQuery({
    ...checkSavedQueryOptions({ userId: user?.id || "", pinId: pin._id }),
    enabled: !!user?.id,
  });
  const isSaved = data?.saved;

  if (!user) {
    throw new Error("Must be logged in to use this feature");
  }

  return (
    <div className="w-full overflow-clip rounded-2xl border border-gray-300">
      <div className="sticky top-header-height right-0 left-0 z-pinpage-detail flex h-16 items-center justify-between bg-background px-4 py-2">
        <div>
          <Button variant="ghost" size="icon-lg">
            <LuDownload />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {isSavePinSuccess ||
            (isSaved && (
              <Link
                to={ROUTES.PROFILE(user.username)}
                button
                variant="ghost"
                size="md"
                className="hover:underline"
              >
                Profile
              </Link>
            ))}

          <SavePinButton
            size="md"
            pinId={pin._id}
            pinPhoto={pin.photoUrl}
            saved={data?.saved}
            onSuccess={setIsSavePinSuccess}
          />
        </div>
      </div>

      <div className="px-4 pb-3">
        <div
          className="relative mx-auto max-h-[70dvh] max-w-full"
          style={{ width: pin.photoWidth, aspectRatio: pin.photoAspectRatio }}
        >
          <Image src={pin.photoUrl} className="absolute size-full" />

          <div
            className={cn(
              "mr-3 ml-auto flex h-full w-fit flex-col justify-end gap-3 pb-3",
              "[&>button]:sticky [&>button]:bg-white/60! [&>button]:text-black"
            )}
          >
            <ZoomOutButton pin={pin} className="bottom-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PinInfo;
