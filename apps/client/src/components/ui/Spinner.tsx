import { cn } from "@repo/ui/lib";

function Spinner(props: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "relative size-12 animate-spin [animation-duration:1.5s]!",
        "*:absolute *:size-4.25",
        "[&>div>div]:size-full [&>div>div]:animate-rainbow-color [&>div>div]:rounded-full",
        props.className
      )}
    >
      <div className="top-0 left-1/2 -translate-x-1/2 animate-scale-down">
        <div />
      </div>

      <div className="bottom-0 left-0 animate-scale-down [animation-delay:-0.33s]">
        <div />
      </div>

      <div className="right-0 bottom-0 animate-scale-down [animation-delay:-0.66s]">
        <div />
      </div>
    </div>
  );
}

export default Spinner;
