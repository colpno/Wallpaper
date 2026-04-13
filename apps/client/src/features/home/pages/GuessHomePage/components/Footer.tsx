import { cn } from "@repo/ui/lib";
import React from "react";

import Icon from "@/components/ui/Icon";
import Link from "@/components/ui/Link";
import Typography from "@/components/ui/Typography";
import { ROUTES } from "@/constants/common";

import { footerMenu } from "../constants";

function Footer(props: React.ComponentProps<"footer">) {
  return (
    <footer
      {...props}
      className={cn("grid grid-cols-2 bg-black p-[100px_150px] text-white", props.className)}
    >
      <nav>
        <Link to={ROUTES.HOME()}>
          <Icon variant="text" className="h-10 w-41.25" />
        </Link>
      </nav>

      <nav className="grid grid-cols-3">
        {footerMenu.map((col) => (
          <div key={col.label} className="flex flex-col gap-4">
            <Typography className="font-bold">{col.label}</Typography>

            {col.items.map((item) => (
              <Link key={item.label} to={item.url} className="hover:underline">
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <Typography size="xs">@ {new Date().getFullYear()} Pinterest</Typography>
    </footer>
  );
}

export default Footer;
