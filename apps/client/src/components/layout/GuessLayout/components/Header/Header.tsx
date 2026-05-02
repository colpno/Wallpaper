import { Button } from "@repo/ui/components";

import FormDialog from "@/components/dialogs/FormDialog";
import SearchBar from "@/components/layout/SearchBar";
import Icon from "@/components/ui/Icon";
import Link from "@/components/ui/Link";
import { ROUTES } from "@/constants/common";
import AuthForm from "@/features/auth/components/AuthForm";

const menu = [{ label: "Explore", url: ROUTES.EXPLORE() }];

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-header flex h-header-height gap-4 bg-background p-4 shadow-[0_2px_1px_rgba(0,0,0,0.05)]">
      <nav className="flex items-center gap-3">
        <Link to={ROUTES.HOME()}>
          <Icon variant="default" />
        </Link>

        <ul className="space-y-2">
          {menu.map((item) => (
            <li key={item.url}>
              <Link to={item.url} navlink button variant="ghost" className="font-bold">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <SearchBar className="flex-1" />

      <div className="space-x-2">
        <FormDialog trigger={<Button>Log In</Button>} slotProps={{ trigger: { asChild: true } }}>
          <Icon variant="favicon" className="m-[8px_auto_6px]" />
          <AuthForm defaultForm="login" className="py-0" />
        </FormDialog>

        <FormDialog
          trigger={<Button variant="secondary">Sign Up</Button>}
          slotProps={{ trigger: { asChild: true } }}
        >
          <Icon variant="favicon" className="m-[8px_auto_6px]" />
          <AuthForm className="py-0" />
        </FormDialog>
      </div>
    </header>
  );
}

export default Header;
