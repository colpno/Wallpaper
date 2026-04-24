import type { PinDB } from "@repo/types";
import { cn } from "@repo/ui/lib";
import { useRef, useState } from "react";
import { BlurhashCanvas } from "react-blurhash";
import { BsThreeDots } from "react-icons/bs";

import { useStore } from "@/app/stores/useStore";
import SavePinButton from "@/components/common/SavePinButton";
import Button from "@/components/ui/Button";
import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import Typography from "@/components/ui/Typography";
import { ROUTES } from "@/constants/common";

import EditButton from "./components/EditButton";

type Props = {
  item: Pick<
    PinDB,
    | "_id"
    | "pinTitle"
    | "pinDescription"
    | "photoUrl"
    | "photoBlurHash"
    | "photoAspectRatio"
    | "photoWidth"
    | "pinOwner"
  >;
  /**
   * @default true
   */
  showActionButton?: boolean;
  editable?: boolean;
};

function PinCard({ item, showActionButton = true, editable }: Props) {
  const user = useStore((state) => state.user);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const odd = useRef<number>(Math.random());
  const showTitle = odd.current > 0.6 && !!item.pinTitle;
  const showDescription = odd.current > 0.7 && !!item.pinDescription;
  const isPinOwner = item.pinOwner === user?.id;

  const handleImageLoaded = () => {
    setIsImageLoading(false);
  };

  return (
    <div className="group/pin space-y-2">
      <div
        className="relative block max-w-full overflow-hidden rounded-2xl"
        style={{
          width: item.photoWidth,
          aspectRatio: item.photoAspectRatio,
        }}
      >
        <Link
          to={ROUTES.PIN(item._id)}
          className={cn(
            "size-full *:size-full *:transition-opacity *:duration-300",
            "before:absolute before:inset-0 before:hidden before:bg-[linear-gradient(to_top,transparent,rgba(0,0,0,0.5))] group-hover/pin:before:block"
          )}
        >
          <BlurhashCanvas
            hash={item.photoBlurHash}
            className={cn("absolute", isImageLoading ? "opacity-100" : "-z-1 opacity-0")}
          />

          <Image
            src={item.photoUrl}
            alt={item.pinTitle ?? "Pin Photo"}
            onLoad={handleImageLoaded}
            className={cn(isImageLoading ? "opacity-0" : "opacity-100")}
          />
        </Link>

        {!isPinOwner && user && (
          <SavePinButton
            pinId={item._id}
            pinPhoto={item.photoUrl}
            className="absolute top-3 right-3 hidden group-hover/pin:flex"
          />
        )}

        {editable && (
          <EditButton
            pinId={item._id}
            pinOwnerId={item.pinOwner}
            pinPhoto={item.photoUrl}
            className="absolute right-3 bottom-3 hidden group-hover/pin:flex"
          />
        )}
      </div>

      {(showTitle || showActionButton) && (
        <div className="flex justify-between gap-x-1 px-1.5">
          {showTitle && (
            <div className="flex-1 space-y-1.5">
              {showTitle && (
                <Typography size="sm" className="line-clamp-1 font-medium">
                  {item.pinTitle}
                </Typography>
              )}

              {showDescription && (
                <Typography size="sm" className="line-clamp-2">
                  {item.pinDescription}
                </Typography>
              )}
            </div>
          )}

          {showActionButton && (
            <Button size="icon-sm" variant="ghost" className="ml-auto">
              <BsThreeDots />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default PinCard;
