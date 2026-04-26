import { cn } from "@repo/ui/lib";
import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
};

const COLLAPSED_HEIGHT = 24;

function PinInfoDescription({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(COLLAPSED_HEIGHT);
  const [showExpender, setShowExpender] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const container = ref.current.parentElement;
    const containerWidth = container?.getBoundingClientRect().width || 0;

    // Check if the content overflows the container to show expander
    if (ref.current.scrollWidth - 20 >= containerWidth / 3) {
      setShowExpender(true);
    } else {
      setShowExpender(false);
    }

    // Set height based on toggle
    if (expanded) {
      setHeight(ref.current.scrollHeight);
    } else {
      setHeight(COLLAPSED_HEIGHT);
    }
  }, [expanded, setHeight, setShowExpender, children]);

  return (
    <div>
      <div className="relative flex overflow-clip transition-[height]" style={{ height }}>
        <div ref={ref} className="font-light">
          {children}
        </div>

        <button
          type="button"
          className={cn(
            "ease absolute right-0 w-1/3 cursor-pointer bg-background pl-4 text-start font-bold transition-opacity duration-300",
            expanded ? "opacity-0" : "opacity-100",
            !showExpender && "hidden"
          )}
          onClick={() => setExpanded(true)}
        >
          ... more
        </button>
      </div>

      <button
        type="button"
        className={cn("cursor-pointer font-bold", (!expanded || !showExpender) && "hidden")}
        onClick={() => setExpanded(false)}
      >
        ... less
      </button>
    </div>
  );
}

export default PinInfoDescription;
