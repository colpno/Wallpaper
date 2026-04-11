import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components";
import { FaRegSquarePlus, FaSquarePlus } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineSpaceDashboard, MdSpaceDashboard } from "react-icons/md";
import { PiHouseBold, PiHouseFill } from "react-icons/pi";

import { useStore } from "@/app/stores/useStore";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Link from "@/components/ui/Link";
import { ROUTES } from "@/constants/common";

function Sidebar() {
  const user = useStore((state) => state.user!);

  const data = {
    mainNav: [
      {
        label: "Home",
        element: (
          <Link href={ROUTES.HOME()} button variant="ghost-icon" size="xl">
            <Icon variant="favicon" className="size-8.5!" />
          </Link>
        ),
      },
      {
        label: "Home",
        element: (
          <Link href={ROUTES.HOME()} navbar button variant="ghost-icon" size="xl">
            {({ isActive }) => (isActive ? <PiHouseFill /> : <PiHouseBold />)}
          </Link>
        ),
      },
      {
        label: "Your boards",
        element: (
          <Link href={ROUTES.BOARDS(user.username)} navbar button variant="ghost-icon" size="xl">
            {({ isActive }) => (isActive ? <MdSpaceDashboard /> : <MdOutlineSpaceDashboard />)}
          </Link>
        ),
      },
      {
        label: "Create",
        element: (
          <Link href={ROUTES.PIN_CREATION()} navbar button variant="ghost-icon" size="xl">
            {({ isActive }) => (isActive ? <FaSquarePlus /> : <FaRegSquarePlus />)}
          </Link>
        ),
      },
    ],
    footer: [
      {
        label: "Settings & Support",
        element: (
          <Button variant="ghost-icon" size="xl" className="mt-auto">
            <IoSettingsOutline />
          </Button>
        ),
      },
    ],
  };

  return (
    <UISidebar collapsible="icon" className="border-gray-300 py-2">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="items-center gap-6">
              {data.mainNav.map((item, i) => (
                <SidebarMenuItem key={i} className="w-fit">
                  <SidebarMenuButton asChild tooltip={item.label}>
                    {item.element}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-0!">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="items-center gap-6">
              {data.footer.map((item, i) => (
                <SidebarMenuItem key={i} className="w-fit">
                  <SidebarMenuButton asChild tooltip={item.label}>
                    {item.element}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </UISidebar>
  );
}

export default Sidebar;
