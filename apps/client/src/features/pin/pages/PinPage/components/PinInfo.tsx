import type { Pin } from "@repo/types";
import { cn } from "@repo/ui/lib";
import { LuDownload } from "react-icons/lu";

import Button from "@/components/ui/Button";
import Image from "@/components/ui/Image";
import { headerHeight } from "@/constants/components";

import ZoomOutButton from "./ZoomOutButton";

function PinInfo(pin: Pick<Pin, "photoUrl" | "photoWidth" | "photoAspectRatio">) {
  return (
    <div className="w-full overflow-clip rounded-2xl border border-gray-300">
      <div
        className="sticky right-0 left-0 z-pinpage-detail flex h-16 bg-background px-4 py-2"
        style={{ top: headerHeight }}
      >
        <Button variant="ghost-icon" size="xl">
          <LuDownload />
        </Button>
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
