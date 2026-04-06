import { TooltipProvider } from "@repo/ui/components";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";

import { queryClient } from "@/lib/react-query/client";

import { routes } from "./routes";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={routes} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
