import Header from "@/components/layout/GuessLayout/components/Header";
import { HEADER_HEIGHT } from "@/constants/components";

function GuessLayout({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div {...props}>
      <Header />

      <main className="min-h-dvh" style={{ paddingTop: HEADER_HEIGHT }}>
        {children}
      </main>
    </div>
  );
}

export default GuessLayout;
