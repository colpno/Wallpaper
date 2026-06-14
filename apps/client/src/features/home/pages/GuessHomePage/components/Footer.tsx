import { cn } from "@repo/ui/lib";
import React from "react";

import Icon from "@/components/ui/Icon";
import Link from "@/components/ui/Link";
import Typography from "@/components/ui/Typography";
import { ROUTES } from "@/constants/common";

import { footerMenu } from "../GuessHomePage.constants";

function Footer(props: React.ComponentProps<"footer">) {
  return (
    <footer
      {...props}
      className={cn(
        "grid bg-black p-[80px_50px] text-white not-lg:gap-10 lg:grid-cols-2 lg:p-[100px_150px]",
        props.className
      )}
    >
      <nav>
        <Link to={ROUTES.HOME()}>
          <Icon variant="text" className="h-10 w-41.25 not-lg:mx-auto" />
        </Link>
      </nav>

      <nav className="not-lg:columns-2 not-lg:space-y-8 lg:grid lg:grid-cols-3">
        {footerMenu.map((col) => (
          <div key={col.label} className="flex break-inside-avoid flex-col gap-4">
            <Typography className="font-bold">{col.label}</Typography>

            {col.items.map((item) => (
              <Link key={item.label} to={item.url} className="hover:underline">
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <Typography size="xs" className="not-lg:text-center">
        @ {new Date().getFullYear()} Pinterest
      </Typography>
    </footer>
  );
}

export default Footer;
