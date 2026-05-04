import { cn } from "@repo/ui/lib";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet, useLocation, useParams } from "react-router";

import { ROUTES } from "@/constants/common";
import {
  type OtherUserProfileContextState,
  OtherUserProfileProvider,
} from "@/contexts/otherUserProfileContext";
import { getUserQueryOptions } from "@/features/user/services/api/queries";

import Avatar from "../common/Avatar";
import Icon from "../ui/Icon";
import Link from "../ui/Link";
import Spinner from "../ui/Spinner";
import Typography from "../ui/Typography";

function OtherUserProfileLayout({ children }: { children?: React.ReactNode }) {
  const { username } = useParams();
  const { pathname } = useLocation();

  const { data, isFetching } = useQuery({
    ...getUserQueryOptions({
      username: username!,
    }),
    enabled: !!username,
  });

  if (isFetching) {
    return <Spinner className="mx-auto" />;
  }

  if (!data) {
    return <Navigate to={ROUTES.HOME()} />;
  }

  const contextValue: OtherUserProfileContextState = {
    user: data,
  };

  return (
    <OtherUserProfileProvider value={contextValue}>
      <div className="flex flex-col items-center justify-center gap-2 pt-3">
        <Avatar src={data.avatarUrl} alt={`${data.username}`} className="size-30" />

        <Typography className="text-[36px] font-bold">{`${data.firstName}${data.lastName ? ` ${data.lastName}` : data.lastName}`}</Typography>

        <div className="flex items-center gap-1">
          <Icon variant="favicon" className="size-5 fill-gray-600" />
          <Typography className="text-neutral-700">{data.username}</Typography>
        </div>

        <div className="mt-7 flex">
          <Link
            to={ROUTES.PROFILE_CREATES(data.username)}
            navlink
            button
            variant="ghost"
            className={({ isActive }) =>
              cn("bg-transparent!", isActive && "underline decoration-2 underline-offset-8")
            }
          >
            Created
          </Link>

          <Link
            to={ROUTES.PROFILE_SAVES(data.username)}
            navlink
            button
            variant="ghost"
            className={({ isActive }) =>
              cn(
                "bg-transparent!",
                (isActive || pathname === ROUTES.PROFILE(data.username)) &&
                  "underline decoration-3 underline-offset-8"
              )
            }
          >
            Saved
          </Link>
        </div>
      </div>

      {children ?? <Outlet />}
    </OtherUserProfileProvider>
  );
}

export default OtherUserProfileLayout;
