import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from "@repo/ui/components";

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
} & React.ComponentProps<typeof UIAvatar>;

function Avatar({ fallback, src, alt, decoding = "async", loading = "lazy", ...props }: Props) {
  return (
    <UIAvatar {...props}>
      <AvatarImage src={src} alt={alt} decoding={decoding} loading={loading} />

      <AvatarFallback>{fallback}</AvatarFallback>
    </UIAvatar>
  );
}

export default Avatar;
