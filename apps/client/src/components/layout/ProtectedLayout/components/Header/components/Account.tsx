import type { DropdownMenuData } from "@/components/common/DropdownMenu";

import { FaChevronDown } from "react-icons/fa6";
import { Navigate } from "react-router";

import { useStore } from "@/app/stores/useStore";
import Avatar from "@/components/common/Avatar";
import DropdownMenu from "@/components/common/DropdownMenu";
import Tooltip from "@/components/common/Tooltip";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { ROUTES } from "@/constants/common";
import { extractFirstLetter } from "@/utils/converters";

function Account() {
  const user = useStore((state) => state.auth.user);
  const logout = useStore((state) => state.auth.logout);

  if (!user) {
    return <Navigate to={ROUTES.HOME()} />;
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
                  {user.firstName}
                  {user.lastName ? ` ${user.lastName}` : ""}
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
                fallback={`${extractFirstLetter(user.firstName)}${user.lastName ? extractFirstLetter(user.lastName) : ""}`}
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
