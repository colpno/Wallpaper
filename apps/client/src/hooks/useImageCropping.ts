import type { Crop } from "react-image-crop";

import { toast } from "@repo/ui/components";
import { useEffect, useRef, useState } from "react";

export const useImageCropping = (initialCrop?: Crop) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop | undefined>(initialCrop);
  const [completedCrop, setCompletedCrop] = useState<Crop | undefined>(initialCrop);

  const cropImage = async () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    if (!context) {
      toast.error("Canvas context doesn't exist, please contact administrator.");
      return;
    }

    if (!completedCrop) {
      toast.error("Please draw a cropping area.");
      return;
    }

    canvas.width = completedCrop.width! * scaleX;
    canvas.height = completedCrop.height! * scaleY;

    context.drawImage(
      image,
      completedCrop.x! * scaleX,
      completedCrop.y! * scaleY,
      completedCrop.width! * scaleX,
      completedCrop.height! * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject("Cannot convert canvas to blob");
        } else {
          resolve(blob);
        }
      });
    });
  };

  useEffect(() => {
    setCrop(initialCrop);
  }, [initialCrop]);

  return {
    imgRef,
    cropImage,
    crop,
    onChange: setCrop,
    onComplete: setCompletedCrop,
  };
};
