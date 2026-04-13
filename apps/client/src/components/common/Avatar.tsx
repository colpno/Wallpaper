import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from "@repo/ui/components";

type Props = {
  fallback?: React.ReactNode;
} & React.ComponentProps<typeof AvatarImage>;

function Avatar({ fallback, ...props }: Props) {
  return (
    <UIAvatar>
      <AvatarImage {...props} />

      <AvatarFallback>{fallback}</AvatarFallback>
    </UIAvatar>
  );
}

export default Avatar;
