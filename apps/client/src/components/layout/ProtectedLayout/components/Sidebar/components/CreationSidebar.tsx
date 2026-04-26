import type { IconType } from "react-icons/lib";

import { cn } from "@repo/ui/lib";
import { LuPin, LuX } from "react-icons/lu";

import Button from "@/components/ui/Button";
import Link from "@/components/ui/Link";
import Typography from "@/components/ui/Typography";
import { ROUTES } from "@/constants/common";

import { useSidebar } from "../Sidebar.context";

type Item = {
  icon: IconType;
  title: string;
  description: string;
  url: string;
};

const data: Item[] = [
  {
    icon: LuPin,
    title: "Pin",
    description: "Post your photos or videos and add links, stickers, effects and more",
    url: ROUTES.PIN_CREATION(),
  },
];

function CreationSidebar() {
  const { setSubSidebar, subSidebar } = useSidebar();

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-sub-sidebar flex w-sub-sidebar-width flex-col border-r border-border bg-background p-3 transition-[translate,opacity] duration-sidebar ease-in-out",
        subSidebar === "creation"
          ? "translate-x-sidebar-width opacity-100"
          : "-translate-x-full opacity-0"
      )}
    >
      <div className="flex flex-row items-start justify-between p-3">
        <Typography size="lg" className="font-bold">
          Create
        </Typography>

        <Button variant="ghost" size="icon-sm" onClick={() => setSubSidebar(null)}>
          <LuX />
        </Button>
      </div>

      <div className="space-y-6">
        {data.map((item) => (
          <Link
            key={item.title}
            to={item.url}
            className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-100"
          >
            <Button variant="secondary" size="icon-xl" className="pointer-events-none">
              <item.icon />
            </Button>

            <div>
              <Typography>{item.title}</Typography>

              <Typography size="sm" className="font-light">
                {item.description}
              </Typography>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CreationSidebar;
