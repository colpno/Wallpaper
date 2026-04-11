import Header from "@/components/layout/GuessLayout/components/Header";
import { headerHeight } from "@/constants/components";

function GuessLayout({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div {...props}>
      <Header />

      <main className="min-h-dvh" style={{ paddingTop: headerHeight }}>
        {children}
      </main>
    </div>
  );
}

export default GuessLayout;
