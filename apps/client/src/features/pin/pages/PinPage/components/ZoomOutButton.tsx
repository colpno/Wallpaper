import type { Pin } from "@repo/types";
import { cn } from "@repo/ui/lib";
import { useState } from "react";
import { LuMinus, LuPlus, LuX } from "react-icons/lu";
import { MdOutlineZoomInMap, MdOutlineZoomOutMap } from "react-icons/md";

import Dialog from "@/components/dialogs/Dialog";
import Button from "@/components/ui/Button";
import Image from "@/components/ui/Image";

type ZoomOptions = {
  default: number;
  min: number;
  max: number;
  step: number;
};

type Props = {
  pin: Pick<Pin, "photoUrl">;
  zoomOptions?: ZoomOptions;
} & React.ComponentProps<typeof Button>;

const defaultZoomOptions: ZoomOptions = {
  default: 1,
  min: 1,
  max: 3,
  step: 1,
};

function ZoomOutButton({ pin, zoomOptions = defaultZoomOptions, ...props }: Props) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(zoomOptions.default);

  const handleScaleUp = () => {
    setScale((prev) => prev + zoomOptions.step);
  };

  const handleScaleDown = () => {
    setScale((prev) => prev - zoomOptions.step);
  };

  return (
    <Dialog
      open={open}
      trigger={
        <Button variant="secondary-icon" size="xl" {...props} onClick={() => setOpen(true)}>
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
        className={cn("size-full max-w-3xl", scale === zoomOptions.max && "max-w-none")}
        style={{ transform: `scale(${scale})` }}
      />

      <Button
        variant="secondary-icon"
        size="xl"
        className="absolute top-3 left-3"
        onClick={() => setOpen(false)}
      >
        <LuX />
      </Button>

      <div className="absolute right-3 bottom-3 flex flex-col gap-2">
        {scale === zoomOptions.max && (
          <Button variant="secondary-icon" size="xl" onClick={() => setScale(zoomOptions.default)}>
            <MdOutlineZoomInMap />
          </Button>
        )}

        <Button
          variant="secondary-icon"
          size="xl"
          disabled={scale === zoomOptions.max}
          onClick={handleScaleUp}
        >
          <LuPlus />
        </Button>

        <Button
          variant="secondary-icon"
          size="xl"
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
