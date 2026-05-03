import { cn } from "@repo/ui/lib";

import Button from "@/components/ui/Button";
import Image from "@/components/ui/Image";
import Typography from "@/components/ui/Typography";

type Props = {
  imageSrc: string;
  onFileChange: (file: File) => void;
} & React.ComponentProps<"div">;

function PhotoEditorImageMenu({ imageSrc, onFileChange, ...props }: Props) {
  return (
    <div {...props} className={cn("space-y-3", props.className)}>
      <Typography className="font-bold">Image</Typography>

      <div className="group/image relative overflow-clip rounded-xl border border-secondary-500 pt-3 pb-7">
        <Image src={imageSrc} alt="Layer image" />
        <div
          className={cn(
            "absolute inset-0 -z-1 bg-background bg-size-[30px_30px] bg-position-[0_0,15px_15px]",
            "bg-[linear-gradient(45deg,rgb(239,239,239)_25%,transparent_25%,transparent_75%,rgb(239,239,239)_75%,rgb(239,239,239)),linear-gradient(45deg,rgb(239,239,239)_25%,transparent_25%,transparent_75%,rgb(239,239,239)_75%,rgb(239,239,239))]"
          )}
        />

        <div className="absolute inset-0 hidden bg-black/60 group-hover/image:block">
          <Button
            variant="tertiary"
            size="sm"
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            Replace
          </Button>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0])}
            className="size-full cursor-pointer opacity-0"
          />
        </div>
      </div>
    </div>
  );
}

export default PhotoEditorImageMenu;
