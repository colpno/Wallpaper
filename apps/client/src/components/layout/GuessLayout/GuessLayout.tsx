import Header from "@/components/layout/GuessLayout/components/Header";

function GuessLayout({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div {...props}>
      <Header />

      <main className="min-h-dvh">{children}</main>
    </div>
  );
}

export default GuessLayout;
