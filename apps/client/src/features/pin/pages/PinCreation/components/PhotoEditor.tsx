import "react-image-crop/dist/ReactCrop.css";
import type { Draft } from "@/app/stores/useDraftStore";

import { cn } from "@repo/ui/lib";
import { useMemo, useState } from "react";
import ReactCrop, { type PixelCrop } from "react-image-crop";

import { useStore } from "@/app/stores/useStore";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import { default as Image, default as ImageComponent } from "@/components/ui/Image";
import Typography from "@/components/ui/Typography";
import { useImageCropping } from "@/hooks/useImageCropping";
import { useObjectURL } from "@/hooks/useObjectURL";
import { mimeToExtension } from "@/utils/converters";

import PhotoEditorImageMenu from "./PhotoEditorImageMenu";

type Layer = {
  url: string;
  label: string;
};

type Props = {
  draft: Draft;
  onDone: () => void;
  onCancel: () => void;
};

const DEFAULT_LAYER_INDEX: number = 0;

function PhotoEditor({ draft, onDone, onCancel }: Props) {
  const originalImageSrc = useObjectURL(draft.originalPhoto);
  const layers = useMemo<Layer[]>(
    () => [{ url: originalImageSrc, label: "Image" }],
    [originalImageSrc]
  );
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(DEFAULT_LAYER_INDEX);
  const selectedLayer = layers[selectedLayerIndex] ?? layers[DEFAULT_LAYER_INDEX];
  const { cropImage, imgRef, onComplete, ...cropperProps } = useImageCropping(
    draft.croppedArea ? { ...draft.croppedArea, unit: "px" } : undefined
  );
  const updateDraft = useStore((state) => state.draft.updateDraft);

  const handleDoneClick = async () => {
    const blob = await cropImage();
    if (!blob) return;

    const file = new File([blob], `photo.${mimeToExtension(blob.type)}`);

    updateDraft(draft.id, { croppedArea: cropperProps.crop, photo: file });
    onDone();
  };

  const handleCropComplete = (crop: PixelCrop): void => {
    updateDraft(draft.id, { croppedArea: crop });
    onComplete(crop);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-y border-b border-border px-4 py-3">
        <Heading className="text-xl">Design your Pin</Heading>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleDoneClick}>Done</Button>
        </div>
      </div>

      {/* Editor */}
      <div className="grid flex-1 grid-cols-[320px_1fr_320px]">
        {/* Left Panel */}
        <div className="py-8">
          <Typography className="px-4 font-bold">Layers</Typography>
          <Typography className="px-4 text-sm">Select a layer to edit</Typography>

          <div className="mt-4 px-2">
            {layers.map((layer, index) => (
              <Button
                key={layer.label}
                variant="transparent"
                className={cn(
                  "w-full justify-start rounded-2xl p-2",
                  selectedLayer?.label === layer.label && "border border-black bg-secondary"
                )}
                onClick={() => setSelectedLayerIndex(index)}
              >
                <ImageComponent
                  src={layer.url}
                  alt="Layer image"
                  className="size-12 rounded-sm object-cover"
                />
                <Typography className="font-normal">Image</Typography>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Panel */}
        <div className="relative bg-secondary">
          <ReactCrop
            {...cropperProps}
            onComplete={handleCropComplete}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Image ref={imgRef} src={originalImageSrc} className="max-w-93.75!" />
          </ReactCrop>
        </div>

        {/* Right Panel */}
        <div className="px-4 py-8">
          {selectedLayer?.label === "Image" && (
            <PhotoEditorImageMenu
              imageSrc={originalImageSrc}
              onFileChange={(file) => updateDraft(draft.id, { photo: file, originalPhoto: file })}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default PhotoEditor;
