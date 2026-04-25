import type { IconType } from "react-icons/lib";

import { cn } from "@repo/ui/lib";
import { LuPin, LuX } from "react-icons/lu";

import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";

import { useSidebar } from "../Sidebar.context";

type Item = {
  icon: IconType;
  title: string;
  description: string;
};

const data: Item[] = [
  {
    icon: LuPin,
    title: "Pin",
    description: "Post your photos or videos and add links, stickers, effects and more",
  },
];

function CreationSidebar() {
  const { setSubSidebar, subSidebar } = useSidebar();

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-sub-sidebar flex w-sub-sidebar-width flex-col border-r border-gray-300 bg-background p-3 transition-[translate,opacity] duration-sidebar ease-in-out",
        subSidebar === "creation"
          ? "translate-x-sidebar-width opacity-100"
          : "-translate-x-full opacity-0"
      )}
    >
      <div className="flex flex-row items-start justify-between p-3">
        <Typography size="lg" className="font-bold">
          Create
        </Typography>

        <Button variant="ghost" size="icon-md" onClick={() => setSubSidebar(null)}>
          <LuX />
        </Button>
      </div>

      <div>
        {data.map((item) => (
          <div key={item.title} className="flex items-center gap-3 p-3">
            <Button variant="secondary" className="size-15">
              <item.icon className="size-7" />
            </Button>

            <div>
              <Typography>{item.title}</Typography>

              <Typography size="sm" className="font-light">
                {item.description}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreationSidebar;
