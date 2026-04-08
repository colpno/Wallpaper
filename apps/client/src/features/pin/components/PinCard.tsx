import type { PinDB } from "@repo/types";
import { cn } from "@repo/ui/lib";
import { useState } from "react";
import { BlurhashCanvas } from "react-blurhash";
import { BsThreeDots } from "react-icons/bs";

import Button from "@/components/ui/Button";
import Image from "@/components/ui/Image";

function PinCard(item: Pick<PinDB, "photoUrl" | "photoBlurHash" | "pinTitle" | "pinDescription">) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const odd = Math.random();
  const showTitle = odd > 0.6;
  const showDescription = odd > 0.7;

  const handleImageLoaded = () => {
    setIsImageLoading(false);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <BlurhashCanvas
          hash={item.photoBlurHash}
          className={cn(
            "absolute inset-0 size-full rounded-xl transition-opacity duration-300",
            isImageLoading ? "opacity-100" : "opacity-0"
          )}
        />

        <Image
          src={item.photoUrl}
          alt={item.pinTitle}
          onLoad={handleImageLoaded}
          className={cn(
            `size-full rounded-xl bg-[#1116] transition-opacity duration-300`,
            isImageLoading ? "opacity-0" : "opacity-100"
          )}
        />
      </div>

      <div className="flex gap-x-1 px-1.5 text-sm leading-[17px]">
        <div className="flex-1 space-y-2">
          {showTitle && <p className="line-clamp-1 font-medium">{item.pinTitle}</p>}

          {showDescription && <p className="line-clamp-2">{item.pinDescription}</p>}
        </div>

        <Button size="sm" variant="ghost-icon">
          <BsThreeDots />
        </Button>
      </div>
    </div>
  );
}

export default PinCard;
