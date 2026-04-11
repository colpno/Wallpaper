import { Button } from "@repo/ui/components";

import FormDialog from "@/components/dialogs/FormDialog";
import Icon from "@/components/ui/Icon";
import Link from "@/components/ui/Link";
import { ROUTES } from "@/constants/common";
import { headerHeight } from "@/constants/components";
import AuthForm from "@/features/auth/components/AuthForm";

import SearchBar from "./components/SearchBar";

const menu = [{ label: "Explore", href: ROUTES.IDEAS() }];

function Header() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-10 flex gap-4 bg-background p-4 shadow-[0_2px_1px_rgba(0,0,0,0.05)]"
      style={{ height: headerHeight }}
    >
      <nav className="flex items-center gap-3">
        <Link href={ROUTES.HOME()}>
          <Icon variant="default" />
        </Link>

        <ul className="space-y-2">
          {menu.map((item) => (
            <li key={item.href}>
              <Link href={item.href} navbar button variant="ghost" className="font-bold">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <SearchBar className="flex-1" />

      <div className="space-x-2">
        <FormDialog trigger={<Button>Log In</Button>} slotProps={{ trigger: { asChild: true } }}>
          <Icon variant="favicon" className="m-[8px_auto_6px] size-10" />
          <AuthForm defaultForm="login" className="py-0" />
        </FormDialog>

        <FormDialog
          trigger={<Button variant="secondary">Sign Up</Button>}
          slotProps={{ trigger: { asChild: true } }}
        >
          <Icon variant="favicon" className="m-[8px_auto_6px] size-10" />
          <AuthForm className="py-0" />
        </FormDialog>
      </div>
    </header>
  );
}

export default Header;
