import type { PinDB } from "@repo/types";
import { DialogClose } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";
import { useState } from "react";
import { LuMinus, LuPlus, LuX } from "react-icons/lu";
import { MdOutlineZoomInMap, MdOutlineZoomOutMap } from "react-icons/md";

import { useStore } from "@/app/stores/useStore";
import SavePinButton from "@/components/common/SavePinButton";
import Dialog from "@/components/dialogs/Dialog";
import Button from "@/components/ui/Button";
import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import { ROUTES } from "@/constants/common";

type ZoomOptions = {
  default: number;
  min: number;
  max: number;
  step: number;
};

type Props = {
  pin: Pick<PinDB, "_id" | "photoUrl" | "photoWidth">;
  zoomOptions?: ZoomOptions;
  saved?: boolean;
} & React.ComponentProps<typeof Button>;

const defaultZoomOptions: ZoomOptions = {
  default: 1,
  min: 1,
  max: 3,
  step: 1,
};

function ZoomOutButton({ pin, zoomOptions = defaultZoomOptions, saved, ...props }: Props) {
  const [scale, setScale] = useState(zoomOptions.default);
  const user = useStore((state) => state.auth.user);

  const handleScaleUp = () => {
    setScale((prev) => prev + zoomOptions.step);
  };

  const handleScaleDown = () => {
    setScale((prev) => prev - zoomOptions.step);
  };

  return (
    <Dialog
      trigger={
        <Button variant="secondary" size="icon-lg" {...props}>
          <MdOutlineZoomOutMap />
        </Button>
      }
      slotProps={{
        trigger: { asChild: true },
        contentContainer: { className: cn("overflow-hidden") },
      }}
      className="grid size-full max-w-none! place-items-center border-0 bg-black/70 p-0 shadow-none backdrop-blur-[3px]"
      showFooter={false}
      showCloseButton={false}
    >
      <Image
        src={pin.photoUrl}
        className={cn(
          "size-full max-w-3xl rounded-lg",
          pin.photoWidth > 620 && "rounded-xl",
          pin.photoWidth > 920 && "rounded-2xl",
          scale === zoomOptions.max && "max-w-none"
        )}
        style={{ transform: `scale(${scale})` }}
      />

      <DialogClose asChild className="absolute top-3 left-3">
        <Button variant="secondary" size="icon-lg">
          <LuX />
        </Button>
      </DialogClose>

      <div className="absolute top-3 right-3 flex gap-2">
        <Link
          to={ROUTES.PROFILE(user!.username)}
          button
          variant="secondary"
          className="hover:underline"
        >
          Profile
        </Link>

        <SavePinButton pinId={pin._id} pinPhoto={pin.photoUrl} saved={saved} />
      </div>

      <div className="absolute right-3 bottom-3 flex flex-col gap-2">
        {scale === zoomOptions.max && (
          <Button variant="secondary" size="icon-lg" onClick={() => setScale(zoomOptions.default)}>
            <MdOutlineZoomInMap />
          </Button>
        )}

        <Button
          variant="secondary"
          size="icon-lg"
          disabled={scale === zoomOptions.max}
          onClick={handleScaleUp}
        >
          <LuPlus />
        </Button>

        <Button
          variant="secondary"
          size="icon-lg"
          disabled={scale === zoomOptions.min}
          onClick={handleScaleDown}
        >
          <LuMinus />
        </Button>
      </div>
    </Dialog>
  );
}

export default ZoomOutButton;
