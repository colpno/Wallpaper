import { buttonVariants } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";
import { PiSlidersHorizontal } from "react-icons/pi";
import { useMatch } from "react-router";

import { useStore } from "@/app/stores/useStore";
import Avatar from "@/components/common/Avatar";
import DropdownMenu, { type DropdownMenuData } from "@/components/common/DropdownMenu";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Link from "@/components/ui/Link";
import Typography from "@/components/ui/Typography";
import { ROUTES } from "@/constants/common";
import { HEADER_HEIGHT } from "@/constants/components";
import {
  useSaveIdeasContext,
  type ViewOption,
} from "@/features/saved-idea/contexts/savedIdeasContext";

const creationDropdownMenu: DropdownMenuData = [
  { key: "pin", label: "Pin", to: ROUTES.PIN_CREATION() },
];

function SavedIdeasHeader(props: React.ComponentProps<"div">) {
  const user = useStore((state) => state.user);

  if (!user) {
    throw new Error("Must be logged in to access this feature");
  }

  const menu = [{ label: "Pins", url: ROUTES.PROFILE(user.username) }];

  return (
    <div
      {...props}
      className={cn("sticky z-saved-ideas-header bg-background pt-5 pb-4", props.className)}
      style={{ top: HEADER_HEIGHT }}
    >
      <Container className="flex justify-between">
        <div className="space-y-6">
          <Heading variant="h1" className="text-4xl">
            Your saved ideas
          </Heading>

          <div>
            {menu.map((item) => (
              <Link
                key={item.url}
                to={item.url}
                navlink
                className={({ isActive }) =>
                  cn("px-3 font-semibold", isActive && "underline decoration-2 underline-offset-8")
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <Link
          to={ROUTES.PROFILE(user.username)}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex translate-x-3.5 -translate-y-3 gap-3 px-3.5 py-3"
          )}
        >
          <Typography className="self-start text-xl font-bold">{`${user.firstName} ${user.lastName}`}</Typography>

          <Avatar
            src={user.avatarUrl}
            alt={`${user.username}'s avatar`}
            className="size-15 rounded-full"
          />
        </Link>
      </Container>

      <Container className="mt-6 flex items-center justify-between">
        <PageActions />

        <DropdownMenu
          data={creationDropdownMenu}
          trigger={<Button>Create</Button>}
          slotProps={{ trigger: { asChild: true } }}
        />
      </Container>
    </div>
  );
}

function PageActions() {
  const { pin } = useSaveIdeasContext();
  const matchPinPage = useMatch(ROUTES.PROFILE("*"));

  if (matchPinPage) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu
          data={[
            {
              key: "view-options",
              label: "View options",
              value: pin.viewOptions,
              onChange: (opt: string) => pin.setViewOption(opt as ViewOption),
              radios: [
                {
                  label: "Standard",
                  value: "standard" satisfies ViewOption,
                },
                {
                  label: "Compact",
                  value: "compact" satisfies ViewOption,
                },
              ],
            },
          ]}
          trigger={
            <Button variant="ghost" size="icon-xl">
              <PiSlidersHorizontal />
            </Button>
          }
          slotProps={{ trigger: { asChild: true } }}
        />

        <Button
          toggle
          variant="secondary"
          size="sm"
          className={cn()}
          pressed={pin.createdByYou}
          onPressedChange={(pressed) => pin.toggleCreatedByYou(pressed)}
        >
          Created by you
        </Button>
      </div>
    );
  }

  return null;
}

export default SavedIdeasHeader;
