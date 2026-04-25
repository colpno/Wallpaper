import { FaRegSquarePlus, FaSquarePlus } from "react-icons/fa6";
import { MdOutlineSpaceDashboard, MdSpaceDashboard } from "react-icons/md";
import { PiGear, PiGearFill, PiHouseBold, PiHouseFill } from "react-icons/pi";

import { useStore } from "@/app/stores/useStore";
import Tooltip from "@/components/common/Tooltip";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Link from "@/components/ui/Link";
import { ROUTES } from "@/constants/common";

import CreationSidebar from "./components/CreationSidebar";
import SettingsSidebar from "./components/SettingsSidebar";
import { type SubSidebarType, useSidebar } from "./Sidebar.context";

function Sidebar() {
  const { setSubSidebar, subSidebar } = useSidebar();
  const user = useStore((state) => state.user!);

  const toggleSubSidebar = (type: SubSidebarType) => {
    setSubSidebar((prev) => (prev !== type ? type : null));
  };

  const data = {
    mainNav: [
      {
        key: "home-1",
        label: "Home",
        element: (
          <Link to={ROUTES.HOME()} button variant="ghost" size="icon-xl">
            <Icon variant="favicon" className="size-8.5!" />
          </Link>
        ),
      },
      {
        key: "home-2",
        label: "Home",
        element: (
          <Link to={ROUTES.HOME()} navlink button variant="ghost" size="icon-xl">
            {({ isActive }) => (isActive ? <PiHouseFill /> : <PiHouseBold />)}
          </Link>
        ),
      },
      {
        key: "your-boards",
        label: "Your boards",
        element: (
          <Link to={ROUTES.PROFILE(user.username)} navlink button variant="ghost" size="icon-xl">
            {({ isActive }) => (isActive ? <MdSpaceDashboard /> : <MdOutlineSpaceDashboard />)}
          </Link>
        ),
      },
      {
        key: "create",
        label: "Create",
        element: (
          <Button variant="ghost" size="icon-xl" onClick={() => toggleSubSidebar("creation")}>
            {subSidebar === "creation" ? <FaSquarePlus /> : <FaRegSquarePlus />}
          </Button>
        ),
      },
    ],
    footer: [
      {
        key: "settings-Support",
        label: "Settings & Support",
        element: (
          <Button variant="ghost" size="icon-xl" onClick={() => toggleSubSidebar("settings")}>
            {subSidebar === "settings" ? <PiGearFill /> : <PiGear />}
          </Button>
        ),
      },
    ],
  };

  return (
    <>
      <CreationSidebar />
      <SettingsSidebar />

      <div className="fixed inset-y-0 left-0 z-sidebar flex w-sidebar-width flex-col border-r border-gray-300 bg-background py-4">
        <div className="flex flex-1 flex-col items-center gap-6">
          {data.mainNav.map((item) => (
            <Tooltip
              key={item.key}
              slotProps={{ trigger: { asChild: true } }}
              trigger={item.element}
              side="right"
            >
              {item.label}
            </Tooltip>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          {data.footer.map((item) => (
            <Tooltip
              key={item.key}
              slotProps={{ trigger: { asChild: true } }}
              trigger={item.element}
              side="right"
            >
              {item.label}
            </Tooltip>
          ))}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
