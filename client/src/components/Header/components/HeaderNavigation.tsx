import { useMemo } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { v4 } from 'uuid';

import { Typography } from '~/components/index.ts';
import { ROUTE_HOME } from '~/constants/routeConstants.ts';
import useRouteMatch from '~/hooks/useRouteMatch.ts';
import { cn } from '~/utils/cssUtils.ts';

interface MenuItem {
  href: string;
  label: string;
}

interface Route {
  href: string;
  label: string;
  menu?: MenuItem[];
}

const routes: Route[] = [
  {
    href: ROUTE_HOME,
    label: 'Trang chủ',
    menu: [
      {
        href: ROUTE_HOME,
        label: 'Trang chủ',
      },
    ],
  },
];

function HeaderNavigation() {
  const uuid = v4();
  const routeLinks = useMemo(() => routes.map((n) => n.href), []);
  const routeMatch = useRouteMatch(routeLinks, true);

  return (
    <div>
      {routes.map((route, index) => (
        <div
          className="relative flex items-center gap-1.5 py-6 [&:hover>div:last-child]:opacity-100 [&:hover>div:last-child]:h-fit [&:not(:hover)>div:last-child]:invisible"
          key={`${uuid}-${index}`}
        >
          <Link
            to={route.href}
            className="flex items-center justify-center flex-col gap-0.5 [&:hover>div]:w-full"
          >
            <Typography className="uppercase text-sm tracking-wider font-medium">
              {route.label}
            </Typography>
            <div
              className={cn(
                'bg-black dark:bg-white h-[1px] transition-all duration-150 ease-in-out w-0',
                routeMatch?.index === index && 'w-full'
              )}
            />
          </Link>
          <FaChevronDown className="text-xs pb-0.5 -translate-y-[1px]" />
          {route.menu && <NavigationMenu routes={route.menu} />}
        </div>
      ))}
    </div>
  );
}

export default HeaderNavigation;

function NavigationMenu({ routes }: { routes: MenuItem[] }) {
  const uuid = v4();
  const menuLinks = useMemo(() => routes.map((r) => r.href), []);
  const menuMatch = useRouteMatch(menuLinks, true);

  return (
    <div className="absolute pb-5 top-full left-0 bg-primary-1 -translate-x-6 w-max h-0 opacity-0 transition-all duration-300 ease-in-out overflow-hidden">
      {routes.map((menu, i) => (
        <Typography
          href={menu.href}
          className={cn(
            'pl-6 pr-12 py-2 line-clamp-1 hover:text-accent-1',
            menuMatch?.index === i && 'text-accent-1'
          )}
          key={`${uuid}-${i}`}
        >
          {menu.label}
        </Typography>
      ))}
    </div>
  );
}
