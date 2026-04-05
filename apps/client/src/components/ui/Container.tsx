import { cn } from "@repo/ui/lib";

type Props = React.ComponentProps<"div"> & {
  component?: React.ElementType;
};

function Container({ component, ...props }: Props) {
  const Comp = component ?? "div";

  return (
    <Comp {...props} className={cn("mx-auto w-full max-w-7xl px-3 2xl:px-0", props.className)} />
  );
}

export default Container;
