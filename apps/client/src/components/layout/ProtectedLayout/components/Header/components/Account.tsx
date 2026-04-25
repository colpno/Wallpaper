import type { DropdownMenuData } from "@/components/common/DropdownMenu";

import { FaChevronDown } from "react-icons/fa6";

import { useStore } from "@/app/stores/useStore";
import Avatar from "@/components/common/Avatar";
import DropdownMenu from "@/components/common/DropdownMenu";
import Tooltip from "@/components/common/Tooltip";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";

const extractFirstWordLetter = (text: string) => text.split(" ").map((t) => t[0]!);

function Account() {
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  if (!user) {
    throw new Error("Must be logged in to access this feature");
  }

  const avatarMenu: DropdownMenuData = [
    {
      key: "currently-in",
      label: "Currently in",
      group: [
        {
          key: "user",
          label: (
            <div className="flex items-center gap-2">
              <Avatar
                src={user.avatarUrl}
                alt={`${user.username}'s avatar`}
                className="size-15 rounded-full"
              />
              <div>
                <Typography className="font-bold">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography className="text-sm font-normal text-gray-500">{user.email}</Typography>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      key: "your-account",
      label: "Your account",
      group: [
        {
          key: "logout",
          label: "Logout",
          onClick: () => logout(),
        },
      ],
    },
  ];

  return (
    <DropdownMenu
      data={avatarMenu}
      trigger={
        <div className="flex items-center gap-1">
          <Tooltip
            trigger={
              <Avatar
                src={user.avatarUrl}
                alt={`${user.username}'s avatar`}
                fallback={`${extractFirstWordLetter(user.firstName)}${extractFirstWordLetter(user.lastName)}`}
              />
            }
          >
            Profile
          </Tooltip>

          <Tooltip
            align="end"
            trigger={
              <Button variant="ghost" size="icon-sm">
                <FaChevronDown />
              </Button>
            }
            slotProps={{
              trigger: {
                asChild: true,
              },
            }}
          >
            Account
          </Tooltip>
        </div>
      }
      slotProps={{
        trigger: {
          asChild: true,
        },
      }}
    />
  );
}

export default Account;
