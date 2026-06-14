import { Suspense } from "react";
import { Outlet } from "react-router";

import Spinner from "../ui/Spinner";

function SuspenseLayout({ children }: { children?: React.ReactNode }) {
  return <Suspense fallback={<Spinner className="mx-auto" />}>{children ?? <Outlet />}</Suspense>;
}

export default SuspenseLayout;
