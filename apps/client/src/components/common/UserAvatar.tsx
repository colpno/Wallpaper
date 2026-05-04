import { cn } from "@repo/ui/lib";

import { useStore } from "@/app/stores/useStore";

import Avatar from "./Avatar";

type Props = Partial<React.ComponentProps<typeof Avatar>>;

const extractFirstLetter = (text: string) => text.split(" ").map((t) => t[0]!);

function UserAvatar(props: Props) {
  const user = useStore((state) => state.auth.user);

  if (!user) {
    return null;
  }

  const fallback = `${extractFirstLetter(user.firstName)}${user.lastName ? extractFirstLetter(user.lastName) : ""}`;

  return (
    <Avatar
      src={user.avatarUrl}
      fallback={fallback}
      alt={`avatar of ${user.username}`}
      {...props}
      className={cn("rounded-full", props.className)}
    />
  );
}

export default UserAvatar;
