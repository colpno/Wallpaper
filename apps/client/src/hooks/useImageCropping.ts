import type { Crop } from "react-image-crop";

import { toast } from "@repo/ui/components";
import { useState } from "react";

export const useImageCropping = () => {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  const cropImage = async (imageSrc: string, croppedArea: Crop) => {
    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      toast.error("Canvas context doesn't exist, please contact administrator.");
      return;
    }

    canvas.width = croppedArea.width;
    canvas.height = croppedArea.height;

    context.drawImage(
      image,
      croppedArea.x,
      croppedArea.y,
      croppedArea.width,
      croppedArea.height,
      0,
      0,
      croppedArea.width,
      croppedArea.height
    );

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject("Blob doesn't while converting image to blob");
        } else {
          resolve(blob);
        }
      });
    });
  };

  return {
    cropImage,
    crop,
    onChange: setCrop,
  };
};
