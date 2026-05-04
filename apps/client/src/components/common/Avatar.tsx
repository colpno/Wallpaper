import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";

type ImgProps = React.ComponentProps<"img">;

type Props = {
  fallback?: React.ReactNode;
  src: string | undefined;
  alt: string;
  /**
   * @default "async"
   */
  decoding?: ImgProps["decoding"];
  /**
   * @default "lazy"
   */
  loading?: ImgProps["loading"];
  slotProps?: {
    image?: React.ComponentProps<typeof AvatarImage>;
    fallback?: React.ComponentProps<typeof AvatarFallback>;
  };
} & React.ComponentProps<typeof UIAvatar>;

function Avatar({
  fallback,
  src,
  alt,
  decoding = "async",
  loading = "lazy",
  slotProps,
  ...props
}: Props) {
  return (
    <UIAvatar {...props} className={cn("@container", props.className)}>
      <AvatarImage
        {...slotProps?.image}
        src={src}
        alt={alt}
        decoding={decoding}
        loading={loading}
      />

      <AvatarFallback
        {...slotProps?.fallback}
        className={cn("text-[40cqw] font-bold", slotProps?.fallback?.className)}
      >
        {fallback}
      </AvatarFallback>
    </UIAvatar>
  );
}

export default Avatar;
