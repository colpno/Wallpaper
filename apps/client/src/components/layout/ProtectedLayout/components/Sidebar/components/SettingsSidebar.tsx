import { cn } from "@repo/ui/lib";
import { LuX } from "react-icons/lu";

import Button from "@/components/ui/Button";
import Link from "@/components/ui/Link";
import Typography from "@/components/ui/Typography";

import { useSidebar } from "../Sidebar.context";

type ItemType = {
  label: string;
  url: string;
};

type Group = {
  key: string;
  title?: string;
  group: ItemType[];
};

const data: Group[] = [
  {
    key: "settings",
    group: [{ label: "Settings", url: "#" }],
  },
  { key: "support", title: "Support", group: [{ label: "Your privacy rights", url: "#" }] },
];

function SettingsSidebar() {
  const { setSubSidebar, subSidebar } = useSidebar();

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-sub-sidebar flex w-sub-sidebar-width flex-col border-r border-border bg-background p-3 transition-transform duration-sidebar",
        subSidebar === "settings"
          ? "translate-x-sidebar-width opacity-100"
          : "-translate-x-full opacity-0"
      )}
    >
      <div className="flex flex-row items-start justify-between p-3">
        <Typography size="lg" className="font-bold">
          Settings & Support
        </Typography>

        <Button variant="ghost" size="icon-sm" onClick={() => setSubSidebar(null)}>
          <LuX />
        </Button>
      </div>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.key}>
            {!!item.title && (
              <Typography size="xs" className="px-3 font-medium text-gray-600">
                {item.title}
              </Typography>
            )}

            {item.group.map((groupItem) => (
              <Link
                key={groupItem.label}
                to={groupItem.url}
                className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium hover:bg-neutral-100"
              >
                {groupItem.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SettingsSidebar;
