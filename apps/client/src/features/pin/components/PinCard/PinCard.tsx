import type { PinDB } from "@repo/types";
import { cn } from "@repo/ui/lib";
import { useRef, useState } from "react";
import { BlurhashCanvas } from "react-blurhash";
import { BsThreeDots } from "react-icons/bs";

import Button from "@/components/ui/Button";
import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import Typography from "@/components/ui/Typography";
import { ROUTES } from "@/constants/common";

function PinCard(
  item: Pick<
    PinDB,
    "_id" | "pinDescription" | "photoUrl" | "photoBlurHash" | "photoAspectRatio" | "photoWidth"
  > &
    Partial<Pick<PinDB, "pinTitle">>
) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const odd = useRef<number>(Math.random());
  const showTitle = odd.current > 0.6 && !!item.pinTitle;
  const showDescription = odd.current > 0.7 && !!item.pinDescription;

  const handleImageLoaded = () => {
    setIsImageLoading(false);
  };

  return (
    <div className="space-y-2">
      <Link
        to={ROUTES.PIN(item._id)}
        className="relative block max-w-full *:size-full *:rounded-2xl *:transition-opacity *:duration-300"
        style={{
          width: item.photoWidth,
          aspectRatio: item.photoAspectRatio,
        }}
      >
        <BlurhashCanvas
          hash={item.photoBlurHash}
          className={cn("absolute", isImageLoading ? "opacity-100" : "-z-1 opacity-0")}
        />

        <Image
          src={item.photoUrl}
          alt={item.pinTitle}
          onLoad={handleImageLoaded}
          className={cn(isImageLoading ? "opacity-0" : "opacity-100")}
        />
      </Link>

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

        <Button size="sm" variant="ghost-icon" className="ml-auto">
          <BsThreeDots />
        </Button>
      </div>
    </div>
  );
}

export default PinCard;
