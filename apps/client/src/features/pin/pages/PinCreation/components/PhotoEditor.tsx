import "react-image-crop/dist/ReactCrop.css";

import { cn } from "@repo/ui/lib";
import { useMemo, useState } from "react";
import ReactCrop from "react-image-crop";

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
  file: File;
  onSubmit: (file: File) => void;
  onCancel: () => void;
};

const DEFAULT_LAYER_INDEX: number = 0;

function PhotoEditor({ file: fileProp, onSubmit, onCancel }: Props) {
  const [file, setFile] = useState(fileProp);
  const imageSrc = useObjectURL(file);
  const layers = useMemo<Layer[]>(() => [{ url: imageSrc, label: "Image" }], [imageSrc]);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(DEFAULT_LAYER_INDEX);
  const selectedLayer = layers[selectedLayerIndex] ?? layers[DEFAULT_LAYER_INDEX];
  const { cropImage, ...cropperProps } = useImageCropping();

  const handleDoneClick = async () => {
    if (!cropperProps.crop) return;

    const blob = await cropImage(imageSrc, cropperProps.crop);
    if (!blob) return;

    const photoFile = new File([blob], `photo.${mimeToExtension(blob.type)}`);
    onSubmit(photoFile);
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
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Image src={imageSrc} className="max-w-93.75!" />
          </ReactCrop>
        </div>

        {/* Right Panel */}
        <div className="px-4 py-8">
          {selectedLayer?.label === "Image" && (
            <PhotoEditorImageMenu imageSrc={imageSrc} onFileChange={setFile} />
          )}
        </div>
      </div>
    </>
  );
}

export default PhotoEditor;
